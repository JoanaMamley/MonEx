import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { BehaviorSubject, map, Observable, Subject, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CounterService {

  constructor(private http: HttpClient) { }

  getCurrentCount(): Observable<number> {
    return this.http.get<number>(`${environment.apiUrl}/count`);
  }
}
