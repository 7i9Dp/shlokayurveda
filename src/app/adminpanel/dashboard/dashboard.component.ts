import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import { AdminService, ADMIN_TOKEN_KEY, ADMIN_USER_KEY } from '../../_services/admin.service';

// Geometry for one bucket of the (hand-drawn SVG) bar chart.
interface Bar {
  codX: number; codY: number; codH: number; barW: number;
  onlineY: number; onlineH: number;
  retX: number; retY: number; retH: number; retW: number;
  labelX: number; label: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['../adminpanel.shared.css', './dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading = false;
  error = '';

  activeQuick: 'month' | 'year' | 'custom' = 'month';
  startDate = '';
  endDate = '';
  grouping: 'day' | 'month' = 'day';
  rangeLabel = '';

  summary: any = null;
  points: any[] = [];

  // Highcharts
  Highcharts: typeof Highcharts = Highcharts;
  pieOptions: Highcharts.Options = {};
  lineOptions: Highcharts.Options = {};
  updatePie = false;
  updateLine = false;

  // Hand-drawn SVG bar chart (kept alongside the Highcharts ones), driven by the same
  // revenue buckets and the Daily/Monthly toggle.
  bar = { width: 0, height: 222, baseY: 192, plotH: 180, leftPad: 44, maxVal: 0, bars: [] as Bar[] };

  // Brand colours reused across both charts.
  private readonly COLOR_COD = '#16a34a';
  private readonly COLOR_ONLINE = '#2563eb';
  private readonly COLOR_RETURNED = '#c0392b';

  constructor(private admin: AdminService, private router: Router) { }

  ngOnInit(): void {
    this.setThisMonth();
    this.load();
  }

  // ---------------------------------------------------------------- filters
  setThisMonth(): void {
    const n = new Date();
    this.startDate = this.toIso(new Date(n.getFullYear(), n.getMonth(), 1));
    this.endDate = this.toIso(new Date(n.getFullYear(), n.getMonth() + 1, 0));
    this.activeQuick = 'month';
    this.grouping = 'day';
  }

  setThisYear(): void {
    const n = new Date();
    this.startDate = this.toIso(new Date(n.getFullYear(), 0, 1));
    this.endDate = this.toIso(new Date(n.getFullYear(), 11, 31));
    this.activeQuick = 'year';
    this.grouping = 'month';
  }

  onCustomChange(): void {
    this.activeQuick = 'custom';
  }

  /** Daily / Monthly toggle for the time-series charts (line + bar). */
  setGrouping(g: 'day' | 'month'): void {
    if (this.grouping === g) { return; }
    this.grouping = g;
    this.load();
  }

  apply(): void {
    this.load();
  }

  // ---------------------------------------------------------------- loading
  load(): void {
    if (!this.startDate || !this.endDate) {
      this.error = 'Please choose a start and end date.';
      return;
    }
    if (this.endDate < this.startDate) {
      this.error = 'End date must be on or after the start date.';
      return;
    }

    this.error = '';
    this.loading = true;
    this.rangeLabel = this.buildRangeLabel();

    this.admin.getDashboard(this.startDate, this.endDate).subscribe({
      next: (res) => {
        this.summary = (res && res.data && res.data.summary) || null;
        this.buildPie();
      },
      error: (e) => this.handleError(e)
    });

    this.admin.getRevenue(this.startDate, this.endDate, this.grouping).subscribe({
      next: (res) => {
        this.points = (res && res.data) || [];
        this.loading = false;
        this.buildLine();
        this.buildBarChart();
      },
      error: (e) => this.handleError(e)
    });
  }

  private handleError(e: any): void {
    this.loading = false;
    if (e && e.status === 401) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      localStorage.removeItem(ADMIN_USER_KEY);
      this.router.navigate(['/login']);
      return;
    }
    this.error = 'Could not load dashboard data. Please try again.';
  }

  // ------------------------------------------------------------------ charts
  private buildPie(): void {
    if (!this.summary) { return; }
    const cod = this.summary.codIncome || 0;
    const online = this.summary.onlineIncome || 0;
    const returned = this.summary.returnedAmount || 0;

    const data: Highcharts.PointOptionsObject[] = [
      { name: 'COD Income', y: cod, color: this.COLOR_COD },
      { name: 'Online Income', y: online, color: this.COLOR_ONLINE }
    ];
    if (returned > 0) {
      data.push({ name: 'Returned / Cancelled', y: returned, color: this.COLOR_RETURNED });
    }

    this.pieOptions = {
      chart: { type: 'pie', backgroundColor: 'transparent', height: 320 },
      title: { text: undefined },
      credits: { enabled: false },
      tooltip: {
        pointFormatter: function () {
          return '<b>₹' + Highcharts.numberFormat(this.y || 0, 0, '.', ',') + '</b> (' +
            Highcharts.numberFormat(this.percentage || 0, 1) + '%)';
        }
      },
      plotOptions: {
        pie: {
          innerSize: '55%',
          dataLabels: {
            enabled: true,
            formatter: function () {
              return '<b>' + this.point.name + '</b>: ₹' + Highcharts.numberFormat(this.y || 0, 0, '.', ',');
            },
            style: { fontWeight: '600', color: '#14200d' }
          }
        }
      },
      series: [{ type: 'pie', name: 'Revenue', data }]
    };
    this.updatePie = true;
  }

  private buildLine(): void {
    const categories = this.points.map(p => this.shortLabel(p.label));

    this.lineOptions = {
      chart: { type: 'line', backgroundColor: 'transparent', height: 340 },
      title: { text: undefined },
      credits: { enabled: false },
      xAxis: { categories, tickmarkPlacement: 'on' },
      yAxis: {
        title: { text: 'Amount (₹)' },
        labels: {
          formatter: function () {
            return '₹' + Highcharts.numberFormat(Number(this.value), 0, '.', ',');
          }
        }
      },
      tooltip: {
        shared: true,
        pointFormatter: function () {
          return '<span style="color:' + this.color + '">●</span> ' + (this.series.name) +
            ': <b>₹' + Highcharts.numberFormat(this.y || 0, 0, '.', ',') + '</b><br/>';
        }
      },
      legend: { enabled: true },
      plotOptions: { line: { marker: { enabled: true, radius: 3 } } },
      series: [
        { type: 'line', name: 'COD Income', color: this.COLOR_COD, data: this.points.map(p => p.codIncome || 0) },
        { type: 'line', name: 'Online Income', color: this.COLOR_ONLINE, data: this.points.map(p => p.onlineIncome || 0) },
        { type: 'line', name: 'Returned', color: this.COLOR_RETURNED, dashStyle: 'ShortDash', data: this.points.map(p => p.returnedAmount || 0) }
      ]
    };
    this.updateLine = true;
  }

  private buildBarChart(): void {
    const c = this.bar;
    c.bars = [];
    const barW = 20, innerGap = 7, retW = 13, groupGap = 24;
    const group = barW + innerGap + retW;
    const step = group + groupGap;

    const max = Math.max(
      1,
      ...this.points.map(p => Math.max((p.codIncome || 0) + (p.onlineIncome || 0), p.returnedAmount || 0))
    );
    c.maxVal = max;
    c.width = c.leftPad + this.points.length * step + 12;

    this.points.forEach((p, i) => {
      const gx = c.leftPad + i * step;
      const cod = p.codIncome || 0;
      const online = p.onlineIncome || 0;
      const ret = p.returnedAmount || 0;

      const codH = (cod / max) * c.plotH;
      const onlineH = (online / max) * c.plotH;
      const retH = (ret / max) * c.plotH;

      c.bars.push({
        barW,
        codX: gx,
        codH,
        codY: c.baseY - codH,
        onlineH,
        onlineY: c.baseY - codH - onlineH,
        retW,
        retX: gx + barW + innerGap,
        retH,
        retY: c.baseY - retH,
        labelX: gx + group / 2,
        label: this.shortLabel(p.label)
      });
    });
  }

  private shortLabel(label: string): string {
    if (!label) { return ''; }
    // 'yyyy-MM' -> 'Mon', 'yyyy-MM-dd' -> 'dd Mon'
    const parts = label.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (parts.length === 2) {
      return months[parseInt(parts[1], 10) - 1] || label;
    }
    if (parts.length === 3) {
      return parts[2] + ' ' + (months[parseInt(parts[1], 10) - 1] || '');
    }
    return label;
  }

  // ----------------------------------------------------------- formatting
  fmtCur(n: number): string {
    const v = n || 0;
    return '₹' + v.toLocaleString('en-IN', { maximumFractionDigits: 0 });
  }

  private toIso(d: Date): string {
    const y = d.getFullYear();
    const m = ('' + (d.getMonth() + 1)).padStart(2, '0');
    const day = ('' + d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private spanDays(): number {
    return (new Date(this.endDate).getTime() - new Date(this.startDate).getTime()) / 86400000;
  }

  private buildRangeLabel(): string {
    const s = new Date(this.startDate);
    const e = new Date(this.endDate);
    const opts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    if (this.activeQuick === 'month') {
      return s.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    }
    if (this.activeQuick === 'year') {
      return '' + s.getFullYear();
    }
    return `${s.toLocaleDateString('en-IN', opts)} to ${e.toLocaleDateString('en-IN', opts)}`;
  }

  get hasChartData(): boolean {
    if (!this.summary) { return false; }
    return (this.summary.codIncome || 0) + (this.summary.onlineIncome || 0) + (this.summary.returnedAmount || 0) > 0;
  }
}
