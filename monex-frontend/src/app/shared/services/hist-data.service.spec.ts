import { TestBed } from '@angular/core/testing';
import { HistDataService } from './hist-data.service';
import { HttpClient } from '@angular/common/http';


describe('HistDataService', () => {
  let service: HistDataService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    TestBed.configureTestingModule({providers: [
          {provide: HttpClient, useValue: httpSpy}]});
    service = TestBed.inject(HistDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
