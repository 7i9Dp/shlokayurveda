import { TestBed } from '@angular/core/testing';

import { DashboardtraineeService } from './dashboardtrainee.service';

describe('DashboardtraineeService', () => {
  let service: DashboardtraineeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardtraineeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
