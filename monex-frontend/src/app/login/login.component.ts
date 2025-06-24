import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { lastValueFrom, Subscription } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { LoginResponse } from '../shared/models/auth-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy{
  loginForm?: FormGroup;
  loginError: string | null = null;
  subscriptions: Subscription[] = [];

  constructor(private router: Router, private authService: AuthService){}

   ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl<null | string>(null, [Validators.required, Validators.email]),
      'password': new FormControl<null | string>(null, [Validators.required, Validators.minLength(8)]),
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async onSubmit() {
    this.loginForm?.markAllAsTouched();
    if (this.loginForm?.valid) {
      const res: void | LoginResponse = await lastValueFrom(this.authService.login({
        email: this.loginForm?.value.email,
        password: this.loginForm?.value.password
      })).catch(err => {
        this.loginError = err.error;
        console.error(err);
      })


      if (res && res.message === 'Login successful') {
        this.loginError = null;
        this.router.navigateByUrl('/dashboard');
      }
    }
  }

  get email(): AbstractControl<any, any> | null | undefined {
    return this.loginForm?.get('email');
  }

  get password(): AbstractControl<any, any> | null | undefined {
    return this.loginForm?.get('password');
  }
}
