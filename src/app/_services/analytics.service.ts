import { Injectable } from '@angular/core';
import injectAnalytics from '@vercel/analytics';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  constructor() {
    // Initialize Vercel Analytics using the `inject` method
    injectAnalytics.inject();
  }
}
