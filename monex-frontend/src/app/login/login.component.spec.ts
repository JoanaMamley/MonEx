import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { AuthService } from '../shared/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { Validators } from '@angular/forms';
import { LoginResponse } from '../shared/models/auth-response.model';
import { mergeMap, of, throwError } from 'rxjs';
import { routes } from '../app.routes';
import { NO_ERRORS_SCHEMA } from '@angular/core';

class MockComponent{}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['login', 'checkAuthStatus']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        provideRouter([
          {
            path: 'dashboard',
            component: MockComponent,
          },
        ]),
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl').and.returnValue(Promise.resolve(true));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create a form with email and password controls', () => {
      expect(component.loginForm).toBeDefined();
      expect(component.loginForm?.get('email')).toBeDefined();
      expect(component.loginForm?.get('password')).toBeDefined();
    });

    it('should have required and email validators on email control', () => {
      const emailControl = component.loginForm?.get('email');
      expect(emailControl?.hasValidator(Validators.required)).toBeTrue();
      expect(emailControl?.hasValidator(Validators.email)).toBeTrue();
    });

    it('should have required validator on password control', () => {
      const passwordControl = component.loginForm?.get('password');
      expect(passwordControl?.hasValidator(Validators.required)).toBeTrue();
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when form is empty', () => {
      expect(component.loginForm?.valid).toBeFalse();
    });

    it('should be invalid when email is invalid', () => {
      component.loginForm?.setValue({ email: 'invalidEmail', password: 'password123' });
      expect(component.loginForm?.valid).toBeFalse();
      expect(component.email?.errors?.['email']).toBeTrue();
    });

    it('should be invalid when password is too short', () => {
      component.loginForm?.setValue({ email: 'test@example.com', password: 'short' });
      expect(component.loginForm?.valid).toBeFalse();
      expect(component.password?.errors?.['minlength']).toBeDefined();
    });

    it('should be valid when both fields are correctly filled', () => {
      component.loginForm?.setValue({ email: 'test@example.com', password: 'password123' });
      expect(component.loginForm?.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
    it('should not call authService.login if form is invalid', fakeAsync(() => {
      component.loginForm?.setValue({ email: '', password: '' });
      component.onSubmit();
      tick();
      expect(authServiceSpy.login).not.toHaveBeenCalled();
    }));

    it('should call authService.login with correct parameters when form is valid', async () => {
      const loginResponse: LoginResponse = { email: 'test@example.com', message: 'Login successful' };
      authServiceSpy.login.and.returnValue(of(loginResponse));

      component.loginForm?.setValue({ email: 'test@example.com', password: 'password123' });
      await component.onSubmit();

      expect(authServiceSpy.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    it('should navigate to /dashboard on successful login', async () => {
      const loginResponse: LoginResponse = { email: 'test@example.com', message: 'Login successful' };
      authServiceSpy.login.and.returnValue(of(loginResponse));

      component.loginForm?.setValue({ email: 'test@example.com', password: 'password123' });
      await component.onSubmit();

      expect(component.loginError).toBeNull();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('should set loginError on login failure', fakeAsync(() => {
      const errorResponse = { error: { message: 'An unexpected error occurred. Please try again later.' } };
      authServiceSpy.login.and.returnValue(throwError(() => errorResponse));

      component.loginForm?.setValue({ email: 'test@example.com', password: 'wrongpassword' });
      spyOn(console, 'error').and.callFake(() => {});
      component.onSubmit();
      tick();

      expect(component.loginError).toBe('An unexpected error occurred. Please try again later.');
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    }));
  });

  describe('Component Destruction', () => {
    it('should call ngOnDestroy and unsubscribe from subscriptions', () => {
      spyOn(component.subscriptions, 'forEach');
      component.ngOnDestroy();
      expect(component.subscriptions.forEach).toHaveBeenCalled();
    });
  });
});
