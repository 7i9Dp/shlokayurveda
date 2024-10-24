import { Component } from '@angular/core';
import { TicketreportService } from 'src/app/_services/ticketreport.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
declare const $: any;

@Component({
  selector: 'app-ticketreports',
  templateUrl: './ticketreports.component.html',
  styleUrls: ['./ticketreports.component.css']
})
export class TicketreportsComponent {

  //date wise filter
  fltTime: number = 0;
  timefilter: number = 0;
  StartDate: string = '';
  EndDate: string = '';
  ticketReportData: any = [];
  fileName: any = 'Report.xlsx';
  fileNamePdf: any = 'Report';
  DateForm: FormGroup;
  submitted: boolean = false;
  submitbtn: boolean = false;

  YearSelected: number = 0;
  year: any = new Date().getFullYear();
  Year: any = [];

  //selectedValuesString: any;

  shouldShowSingleTicket: boolean = false;
  shouldShowGroupicket: boolean = false;
  shouldShowNRITicket: boolean = false;
  shouldShowCameraPass: boolean = false;
  showTableHeaders: boolean = false;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  totalMaleSum: number = 0;
  totalFemaleSum: number = 0;
  totalChildrenSum: number = 0;
  TotalVisitorsSum: number = 0;
  totalamountCollected: number = 0;
  //Group
  totalGroupMaleSum: number = 0;
  totalGroupFemaleSum: number = 0;
  totalGroupChildrenSum: number = 0;
  TotalGroupVisitorsSum: number = 0;
  totalGroupamountCollected: number = 0;
  //NRI
  totalNRIMaleSum: number = 0;
  totalNRIFemaleSum: number = 0;
  totalNRIChildrenSum: number = 0;
  TotalNRIVisitorsSum: number = 0;
  totalNRIamountCollected: number = 0;
  //Cam
  TotalCamPassSum: number = 0;
  totalCamAmountCollected: number = 0;
  //Grand Total
  GrandTotalFinal: number = 0;

  constructor(private ticketreportService: TicketreportService, private fb: FormBuilder) {

    this.DateForm = this.fb.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getTicketReport();
    this.loopForYears();
    this.shouldShowSingleTicket = true;
    this.shouldShowGroupicket = true;
    this.shouldShowNRITicket = true;
    this.shouldShowCameraPass = true;
    this.showTableHeaders = this.shouldShowSingleTicket || this.shouldShowGroupicket || this.shouldShowNRITicket || this.shouldShowCameraPass;
  }

  loopForYears() {
    for (let y = 2021; y <= this.year; y++) {
      this.Year.push(y);
    }
  }

  YearSelectedOption() {
    debugger
    this.getTicketReport();
    //this.getmasterreport(this.YearSelected)
  }

  onTimeChangeEvent() {
    debugger
    this.timefilter = this.fltTime;
    if (this.timefilter == 13) {
      this.submitted = false;
      this.submitbtn = false;
      //this.ID = id;
      //this.flagstatus = !flag;
      this.resetForm();
      $("#opendialogeDate").modal('toggle');
    }
    else {
      this.getTicketReport();
    }
    //this.updateSums();
  }

  get f1() { return this.DateForm.controls; }

  getTicketReport() {
    debugger
    if (this.YearSelected == 0) {
      this.YearSelected = this.year
    }
    if (this.timefilter <= 0) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      this.timefilter = parseInt(month, 10);
    }
    this.ticketreportService.getTicketReport(this.StartDate, this.EndDate, this.timefilter, this.YearSelected).subscribe(res => {
      if (res.isSuccess) {
        if (res.data.length > 0) {
          debugger
          this.ticketReportData = res.data;
          this.updateSums();
        }
        else {
          this.ticketReportData = [];
          this.updateSums();
        }
      }
      else {
        this.ticketReportData = [];
        this.updateSums();
      }
    },
      err => {
      });
  }

  ExportToExel(): void {
    debugger
    let element = document.getElementById('DataTables_Table_0')
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element)
    const wb: XLSX.WorkBook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, this.fileName)
  }

  ExportToPDF(): void {
    debugger;
    let element = document.getElementById('DataTables_Table_0');

    if (element) {
      // Create a new jsPDF instance
      const pdf = new jsPDF();

      // Convert the HTML element to a canvas
      html2canvas(element, {
        scale: 2 // Adjust the scale as needed
      }).then(canvas => {
        // Convert the canvas to an image
        const imgData = canvas.toDataURL('image/png');

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);

        // Save the PDF with a specified file name
        pdf.save(this.fileNamePdf + '.pdf');
      });
    } else {
      console.error("Element with id 'DataTables_Table_0' not found.");
    }
  }

  CustomeDate() {
    this.submitted = true;
    if (this.DateForm.invalid) {
      return;
    }
    else {
      debugger
      this.submitbtn = true;
      this.StartDate = this.DateForm.value.startdate;
      this.EndDate = this.DateForm.value.enddate;
      this.getTicketReport();
      $("#opendialogeDate").modal('toggle');
    }
    this.fltTime = 0;
  }

  onCancle() {
    this.fltTime = 0;
    $("#opendialogeDate").modal('toggle');
    this.resetForm();
    this.getTicketReport();
  }

  resetForm() {
    this.DateForm = this.fb.group({
      startdate: ['', Validators.required],
      enddate: ['', Validators.required]
    })
  }

  CustomReportsToggle() {
    $("#opendialogeCustomReport").modal('toggle');
  }
  onCancleCustomReport() {
    $("#opendialogeCustomReport").modal('toggle');
  }

  CustomeReport() { }

  //selectedValues: string[] = [];

  // onChangeRadioButton(e: any) {
  //   debugger
  //   const value = e.target.value;
  //   const isChecked = e.target.checked;

  //   if (isChecked) {
  //     // Add the value to the selectedValues array if checked
  //     if (!this.selectedValues.includes(value)) {
  //       this.selectedValues.push(value);
  //     }
  //   } else {
  //     // Remove the value from the selectedValues array if unchecked
  //     const index = this.selectedValues.indexOf(value);
  //     if (index !== -1) {
  //       this.selectedValues.splice(index, 1);
  //     }
  //   }
  //   this.selectedValuesString = this.selectedValues.join(',');
  //   console.log(this.selectedValuesString);
  // }

  onChangeRadioButton(e: any) {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (value === '1') {
      this.shouldShowSingleTicket = isChecked;
    } else if (value === '2') {
      this.shouldShowNRITicket = isChecked;
    } else if (value === '3') {
      this.shouldShowCameraPass = isChecked;
    } else if (value === '4') {
      this.shouldShowGroupicket = isChecked;
    }
    this.showTableHeaders = this.shouldShowSingleTicket || this.shouldShowGroupicket || this.shouldShowNRITicket || this.shouldShowCameraPass;
    this.updateSums();
  }

  // In your Angular component
  monthName(monthNumber: number): string {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    if (monthNumber >= 1 && monthNumber <= 12) {
      return monthNames[monthNumber - 1];
    }

    return ''; // Handle invalid month numbers gracefully
  }

  updateSums() {
    this.totalMaleSum = this.totalFemaleSum = this.totalChildrenSum = this.TotalVisitorsSum = this.totalamountCollected = 0; //Single
    this.totalGroupMaleSum = this.totalGroupFemaleSum = this.totalGroupChildrenSum = this.TotalGroupVisitorsSum = this.totalGroupamountCollected = 0; //Group
    this.totalNRIMaleSum = this.totalNRIFemaleSum = this.totalNRIChildrenSum = this.TotalNRIVisitorsSum = this.totalNRIamountCollected = 0; //NRI
    this.TotalCamPassSum = this.totalCamAmountCollected = 0; //Camera
    this.GrandTotalFinal = 0; // GrandTotal

    this.ticketReportData.forEach((trd: any) => {
      debugger
      if (this.showTableHeaders) {
        if (this.shouldShowSingleTicket) {
          this.totalMaleSum += trd.male || 0;
          this.totalFemaleSum += trd.female || 0;
          this.totalChildrenSum += trd.children || 0;
          this.totalamountCollected += trd.amounT_COLLECTED || 0;
        }
        if (this.shouldShowGroupicket) {
          this.totalGroupMaleSum += trd.g_MALE || 0;
          this.totalGroupFemaleSum += trd.g_FEMALE || 0;
          this.totalGroupChildrenSum += trd.g_CHILDREN || 0;
          this.totalGroupamountCollected += trd.amounT_COLLECTED_G || 0;
        }
        if (this.shouldShowNRITicket) {
          this.totalNRIMaleSum += trd.malE_NRI || 0;
          this.totalNRIFemaleSum += trd.femalE_NRI || 0;
          this.totalNRIChildrenSum += trd.childreN_NRI || 0;
          this.totalNRIamountCollected += trd.amounT_COLLECTED_NRI || 0;
        }
        if (this.shouldShowCameraPass) {
          this.TotalCamPassSum += trd.camerA_PASS || 0;
          this.totalCamAmountCollected += trd.total || 0;
        }
      }
    });

    this.TotalVisitorsSum =
      (this.shouldShowSingleTicket ? this.totalMaleSum + this.totalFemaleSum + this.totalChildrenSum : 0);
    this.TotalGroupVisitorsSum =
      (this.shouldShowGroupicket ? this.totalGroupMaleSum + this.totalGroupFemaleSum + this.totalGroupChildrenSum : 0);
    this.TotalNRIVisitorsSum =
      (this.shouldShowNRITicket ? this.totalNRIMaleSum + this.totalNRIFemaleSum + this.totalNRIChildrenSum : 0);
    this.TotalCamPassSum =
      (this.shouldShowCameraPass ? this.TotalCamPassSum : 0);

    this.GrandTotalFinal =
      (this.showTableHeaders ? this.totalamountCollected + this.totalGroupamountCollected + this.totalNRIamountCollected + this.totalCamAmountCollected : 0);

  }


}
