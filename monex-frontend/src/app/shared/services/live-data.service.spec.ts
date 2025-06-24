import { TestBed } from '@angular/core/testing';

import { LiveDataService } from './live-data.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

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

  describe('getLiveCurrencyRateData', () => {
    it('should make get request to fetch live currency rate', () => {
      httpSpy.get.and.returnValue(of({
          "USDEUR": 0.867699,
          "USDAUD": 1.541307
      }));

      service.getLiveCurrencyRateData('EUR', 'AUD').subscribe(response => {
        expect(response).toEqual({
          "USDEUR": 0.867699,
          "USDAUD": 1.541307
        });
      });

      expect(httpSpy.get).toHaveBeenCalled();
    })
  })
});
