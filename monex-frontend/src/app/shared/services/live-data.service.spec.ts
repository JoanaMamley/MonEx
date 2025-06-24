import { TestBed } from '@angular/core/testing';

import { LiveDataService } from './live-data.service';
import { HttpClient } from '@angular/common/http';

describe('LiveDataService', () => {
  let service: LiveDataService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    TestBed.configureTestingModule({providers: [
          {provide: HttpClient, useValue: httpSpy}]});
    service = TestBed.inject(LiveDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
