import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit{
  signUpForm?: FormGroup;
  registrationError: string | null = null;

  constructor(private router: Router, private authService: AuthService){}

  ngOnInit(): void {
    this.signUpForm = new FormGroup({
      'email': new FormControl<null | string>(null, [Validators.required, Validators.email]),
      'password': new FormControl<null | string>(null, [Validators.required, Validators.minLength(8)]),
      'confirmPassword': new FormControl<null | string>(null, [Validators.required, Validators.minLength(8)])
    }, this.passwordMatchValidator())
  }

  passwordMatchValidator(): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      const passwordControl = formGroup.get('password');
      const confirmPasswordControl = formGroup.get('confirmPassword');

      if (passwordControl && confirmPasswordControl && passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }

      return null;
    };
  }

  async onSubmit() {
    this.signUpForm?.markAllAsTouched();
    if (this.signUpForm?.valid) {
      try {
        await lastValueFrom( this.authService.signup({
          email: this.signUpForm?.get('email')?.value,
          password: this.signUpForm?.get('password')?.value
        }))
        this.router.navigate(['/login']);
      }
      catch(error) {
        if (error instanceof HttpErrorResponse) {
          console.error(error);
          this.registrationError = error.error;
        }
        else {
          this.registrationError = 'An unexpected error occurred. Please try again later.';
        }
      }
    }
  }

  get username(): AbstractControl<any, any> | null | undefined {
    return this.signUpForm?.get('username');
  }

  get email(): AbstractControl<any, any> | null | undefined {
    return this.signUpForm?.get('email');
  }

  get password(): AbstractControl<any, any> | null | undefined {
    return this.signUpForm?.get('password');
  }

  get confirmPassword(): AbstractControl<any, any> | null | undefined {
    return this.signUpForm?.get('confirmPassword');
  }

  get hasPasswordMismatchError(): boolean | undefined {
    return this.signUpForm?.invalid && this.signUpForm.hasError('passwordMismatch') && (this.confirmPassword?.touched || this.confirmPassword?.dirty) && (this.password?.touched || this.password?.dirty);
  }

}
