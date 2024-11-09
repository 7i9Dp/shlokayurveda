import { Component } from '@angular/core';
import { AnalyticsService } from './_services/analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private analyticsService: AnalyticsService) {}
  title = 'bookingsystem';
}

