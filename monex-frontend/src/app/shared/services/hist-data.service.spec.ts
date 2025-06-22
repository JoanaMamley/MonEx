import { TestBed } from '@angular/core/testing';

import { HistDataService } from '../hist-data.service';

describe('HistDataService', () => {
  let service: HistDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
