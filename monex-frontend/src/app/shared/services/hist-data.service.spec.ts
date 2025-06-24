import { TestBed } from '@angular/core/testing';
import { HistDataService } from './hist-data.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { HistRateData } from '../models/hist-data.model';


describe('HistDataService', () => {
  let service: HistDataService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  const mockedHistRateData: HistRateData[] = [
    {
      id: 1,
      rate: 23.4567,
      currency: 'USD',
      date: '2020-04-12'
    },
    {
      id: 2,
      rate: 0.56322,
      currency: 'AMD',
      date: '2020-04-12'
    },
  ]

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    TestBed.configureTestingModule({providers: [
          {provide: HttpClient, useValue: httpSpy}]});
    service = TestBed.inject(HistDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  describe('getHistRateData', () => {
    it('it should make get request to get current count', async () => {
      httpSpy.get.and.returnValue(of(mockedHistRateData));

      const response = await service.getHistRateData('2020-04-12');

      expect(response).toEqual(mockedHistRateData);
      expect(httpSpy.get).toHaveBeenCalled();
    })
  })
});
