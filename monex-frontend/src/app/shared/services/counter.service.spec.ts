import { TestBed } from '@angular/core/testing';

import { CounterService } from './counter.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('CounterService', () => {
  let service: CounterService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    TestBed.configureTestingModule({providers: [
          {provide: HttpClient, useValue: httpSpy}]});
    service = TestBed.inject(CounterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentCount', () => {
    it('it should make get request to get current count', () => {
      httpSpy.get.and.returnValue(of(4));

      service.getCurrentCount().subscribe(response => {
        expect(response).toBe(4);
      });

      expect(httpSpy.get).toHaveBeenCalled();
    })
  })
});
