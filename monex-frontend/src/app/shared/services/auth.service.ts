import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../environment';
import { Router } from '@angular/router';
import { AuthRequest } from '../models/auth-request.model';
import { LoginResponse } from '../models/auth-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // BehaviorSubject to hold the current authentication state
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUser = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient, private router: Router) { }

  get isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  get currentUsername(): Observable<string | null> {
      return this.currentUser.asObservable();
  }

  // Check the authentication status by calling the protected /profile endpoint
  checkAuthStatus(): Observable<boolean> {
    return this.http.get<any>(`${environment.apiUrl}/auth/profile`, { withCredentials: true }).pipe(
      map(response => {
        if (response && response.email) {
            this.loggedIn.next(true);
            this.currentUser.next(response.email);
            return true;
        }
        this.loggedIn.next(false);
        this.currentUser.next(null);
        return false;
      }),
      catchError(() => {
        this.loggedIn.next(false);
        this.currentUser.next(null);
        return of(false);
      })
    );
  }

  signup(user: AuthRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/signup`, user, { responseType: 'text' });
  }

  login(credentials: AuthRequest): Observable<LoginResponse> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        if (response && response.email) {
            this.loggedIn.next(true);
            this.currentUser.next(response.email);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true, responseType: 'text' }).pipe(
      tap(() => {
        this.loggedIn.next(false);
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      })
    );
  }
}
