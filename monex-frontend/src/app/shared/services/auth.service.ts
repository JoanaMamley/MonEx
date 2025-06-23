import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../environment';
import { Router } from '@angular/router';
import { AuthRequest } from '../models/auth-request.model';

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
    return this.http.get<any>(`${environment.apiUrl}/profile`, { withCredentials: true }).pipe(
      map(response => {
        if (response && response.username) {
            this.loggedIn.next(true);
            this.currentUser.next(response.username);
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
    return this.http.post(`${environment.apiUrl}/signup`, user, { responseType: 'text' });
  }

  login(credentials: AuthRequest): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
      tap(response => {
        if (response && response.username) {
            this.loggedIn.next(true);
            this.currentUser.next(response.username);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post(`${environment.apiUrl}/logout`, {}, { withCredentials: true, responseType: 'text' }).pipe(
      tap(() => {
        this.loggedIn.next(false);
        this.currentUser.next(null);
        this.router.navigate(['/login']);
      })
    );
  }
}
