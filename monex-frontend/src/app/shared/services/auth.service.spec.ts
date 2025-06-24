import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { environment } from '../environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['post', 'get']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate'])

    TestBed.configureTestingModule({providers: [
          {provide: HttpClient, useValue: httpSpy},
          {provide: Router, useValue: routerSpy}
        ]});

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkAuthStatus', () => {
    it('should return true and update state when profile request succeeds', () => {
      const mockResponse = { email: 'test@example.com' };
      httpSpy.get.and.returnValue(of(mockResponse));

      service.checkAuthStatus().subscribe(result => {
        expect(result).toBe(true);
        expect((service as any).loggedIn.value).toBe(true);
        expect((service as any).currentUser.value).toBe('test@example.com');
      });

      expect(httpSpy.get).toHaveBeenCalledWith(`${environment.apiUrl}/auth/profile`, { withCredentials: true });
    });

    it('should return false and reset state when profile request fails', () => {
      httpSpy.get.and.returnValue(throwError(() => new Error('error')));

      service.checkAuthStatus().subscribe(result => {
        expect(result).toBe(false);
        expect((service as any).loggedIn.value).toBe(false);
        expect((service as any).currentUser.value).toBe(null);
      });
    });
  })

  describe('signup', () => {
    it('should make POST request to signup endpoint and return response', () => {
      const user = { email: 'test@example.com', password: 'password' };
      const mockResponse = 'Account created';
      httpSpy.post.and.returnValue(of(mockResponse));

      service.signup(user).subscribe(response => {
        expect(response).toBe(mockResponse);
      });

      expect(httpSpy.post).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should update state and return response when login succeeds with email', () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = { email: 'test@example.com', message: 'Login successful' };
      httpSpy.post.and.returnValue(of(mockResponse));

      service.login(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect((service as any).loggedIn.value).toBe(true);
        expect((service as any).currentUser.value).toBe('test@example.com');
      });

      expect(httpSpy.post).toHaveBeenCalledWith(`${environment.apiUrl}/auth/login`, credentials, { withCredentials: true });
    });

    it('should not update state when login response lacks email', () => {
      const credentials = { email: 'test@example.com', password: 'password' };
      const mockResponse = {};
      httpSpy.post.and.returnValue(of(mockResponse));

      service.login(credentials).subscribe(response => {
        expect((service as any).loggedIn.value).toBe(false);
        expect((service as any).currentUser.value).toBe(null);
      });
    });
  });


  describe('logout', () => {
    it('should reset state and navigate to login when logout succeeds', () => {
      const mockResponse = 'Logged out';
      httpSpy.post.and.returnValue(of(mockResponse));

      service.logout().subscribe(response => {
        expect(response).toBe(mockResponse);
        expect((service as any).loggedIn.value).toBe(false);
        expect((service as any).currentUser.value).toBe(null);
        expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
      });

      expect(httpSpy.post).toHaveBeenCalled();
    });

    it('should preserve state when logout fails', () => {
      (service as any).loggedIn.next(true);
      (service as any).currentUser.next('test@example.com');
      httpSpy.post.and.returnValue(throwError(() => new Error('error')));

      service.logout().subscribe({
        error: (err) => {
          expect(err).toBeTruthy();
          expect((service as any).loggedIn.value).toBe(true);
          expect((service as any).currentUser.value).toBe('test@example.com');
          expect(routerSpy.navigate).not.toHaveBeenCalled();
        }
      });
    });
  });


  describe('observables', () => {
    it('isLoggedIn should emit current loggedIn state', () => {
      let loggedInValue: boolean | undefined;
      service.isLoggedIn.subscribe(value => loggedInValue = value);
      expect(loggedInValue).toBe(false);

      (service as any).loggedIn.next(true);
      expect(loggedInValue).toBe(true);
    });

    it('currentUsername should emit current user state', () => {
      let usernameValue: string | null | undefined;
      service.currentUsername.subscribe(value => usernameValue = value);
      expect(usernameValue).toBe(null);

      (service as any).currentUser.next('test@example.com');
      expect(usernameValue).toBe('test@example.com');
    });
  });

});
