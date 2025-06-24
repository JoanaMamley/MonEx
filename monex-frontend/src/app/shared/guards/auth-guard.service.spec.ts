import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { mergeMap, of, throwError } from 'rxjs';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['checkAuthStatus']);
    const routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate'])

    TestBed.configureTestingModule(
      {providers: [
              AuthGuard,
              {provide: AuthService, useValue: authServiceSpy},
              {provide: Router, useValue: routerSpy}
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is authenticated', (done) => {
    authService.checkAuthStatus.and.returnValue(of(true));

    guard.canActivate().subscribe(result => {
      expect(result).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should prevent activation and navigate to login when user is not authenticated', (done) => {
    authService.checkAuthStatus.and.returnValue(of(false));

    guard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });

  it('should handle error and navigate to login', (done) => {
    authService.checkAuthStatus.and.returnValue(
      of(null).pipe(
        mergeMap(() => throwError(() => new Error('Auth error')))
      )
    );

    guard.canActivate().subscribe(result => {
      expect(result).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
