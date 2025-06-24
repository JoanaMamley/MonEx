import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { RegisterComponent } from './register.component';
import { provideRouter, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { of, throwError } from 'rxjs';
import { Validators } from '@angular/forms';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['signup'])

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        {provide: AuthService, useValue: authServiceSpy},
        provideRouter([]),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Initialization', () => {
    it('should create a form with email and password controls', () => {
      expect(component.signUpForm).toBeDefined();
      expect(component.signUpForm?.get('email')).toBeDefined();
      expect(component.signUpForm?.get('password')).toBeDefined();
    });

    it('should have required and email validators on email control', () => {
      const emailControl = component.signUpForm?.get('email');
      expect(emailControl?.hasValidator(Validators.required)).toBeTrue();
      expect(emailControl?.hasValidator(Validators.email)).toBeTrue();
    });

    it('should have required validator on password controls', () => {
      const passwordControl = component.signUpForm?.get('password');
      const confirmPasswordControl = component.signUpForm?.get('confirmPassword');
      expect(passwordControl?.hasValidator(Validators.required)).toBeTrue();
      expect(confirmPasswordControl?.hasValidator(Validators.required)).toBeTrue();
    });
  });

  describe('Form Validation', () => {
    it('should be invalid when form is empty', () => {
      expect(component.signUpForm?.valid).toBeFalse();
    });

    it('should be invalid when email is invalid', () => {
      component.signUpForm?.setValue({ email: 'invalidEmail', password: 'password123', confirmPassword: 'password123' });
      expect(component.signUpForm?.valid).toBeFalse();
      expect(component.email?.errors?.['email']).toBeTrue();
    });

    it('should be invalid when password is too short', () => {
      component.signUpForm?.setValue({ email: 'test@example.com', password: 'short', confirmPassword: 'short' });
      expect(component.signUpForm?.valid).toBeFalse();
      expect(component.password?.errors?.['minlength']).toBeDefined();
    });

    it('should be invalid when passwords do not match', () => {
      component.signUpForm?.setValue({ email: 'test@example.com', password: 'short', confirmPassword: 'password123' });
      expect(component.signUpForm?.valid).toBeFalse();
      expect(component.signUpForm?.errors?.['passwordMismatch']).toBeDefined();
    });

    it('should be valid when all fields are correctly filled', () => {
      component.signUpForm?.setValue({ email: 'test@example.com', password: 'password123', confirmPassword: 'password123' });
      expect(component.signUpForm?.valid).toBeTrue();
    });
  });

  describe('Form Submission', () => {
      it('should not call authService.signup if form is invalid', fakeAsync(() => {
        component.signUpForm?.setValue({ email: '', password: '', confirmPassword: '' });
        component.onSubmit();
        tick();
        expect(authServiceSpy.signup).not.toHaveBeenCalled();
      }));
  
      it('should call authService.signup with correct parameters when form is valid', async () => {
        authServiceSpy.signup.and.returnValue(of({}));
  
        component.signUpForm?.setValue({ email: 'test@example.com', password: 'password123', confirmPassword: 'password123' });
        await component.onSubmit();
  
        expect(authServiceSpy.signup).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
  
      it('should navigate to /login on successful signup', async () => {
        authServiceSpy.signup.and.returnValue(of({}));
  
        component.signUpForm?.setValue({ email: 'test@example.com', password: 'password123', confirmPassword: 'password123' });
        await component.onSubmit();
  
        expect(component.registrationError).toBeNull();
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      });
  
      it('should set registrationError on registration failure', fakeAsync(() => {
        const errorResponse = { error: { message: 'An unexpected error occurred. Please try again later.' } };
        authServiceSpy.signup.and.returnValue(throwError(() => errorResponse));
  
        component.signUpForm?.setValue({ email: 'test@example.com', password: 'password123', confirmPassword: 'password123' });
        spyOn(console, 'error').and.callFake(() => {});
        component.onSubmit();
        tick();
  
        expect(component.registrationError).toBe('An unexpected error occurred. Please try again later.');
        expect(router.navigate).not.toHaveBeenCalled();
      }));
    });
  
});

