import { TestBed } from '@angular/core/testing';

import { TraineereportService } from './traineereport.service';

describe('TraineereportService', () => {
  let service: TraineereportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineereportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
