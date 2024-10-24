import { TestBed } from '@angular/core/testing';

import { TraineefeedbackService } from './traineefeedback.service';

describe('TraineefeedbackService', () => {
  let service: TraineefeedbackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TraineefeedbackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
