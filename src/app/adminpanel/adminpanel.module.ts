import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';

import { AdminShellComponent } from './admin-shell/admin-shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsComponent } from './reports/reports.component';
import { ReturnsComponent } from './returns/returns.component';

/**
 * The standalone admin panel (Dashboard / Returns / Reports). Declared eagerly and imported
 * by AppModule; the routes themselves live in app-routing.module so the panel's URLs
 * (/admin/dashboard etc.) can be registered *before* the storefront's /admin route and win
 * the match without colliding with it.
 */
@NgModule({
  declarations: [
    AdminShellComponent,
    DashboardComponent,
    ReportsComponent,
    ReturnsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HighchartsChartModule
  ],
  exports: [
    DashboardComponent,
    ReportsComponent,
    ReturnsComponent
  ]
})
export class AdminPanelModule { }
