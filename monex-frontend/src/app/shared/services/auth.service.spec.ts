import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'get']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl'])
    TestBed.configureTestingModule({providers: [
          {provide: HttpClient, useValue: httpSpy},
          {provide: Router, useValue: routerSpy}
        ]});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
