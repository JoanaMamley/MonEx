import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let service: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['checkAuthStatus']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigateByUrl'])
    TestBed.configureTestingModule({providers: [
              {provide: AuthService, useValue: authServiceSpy},
              {provide: Router, useValue: routerSpy}
            ]});
    service = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
