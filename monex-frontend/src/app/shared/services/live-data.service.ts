import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LiveDataService {

  constructor(private http: HttpClient) { }

  getLiveCurrencyRateData(source: string, target: string):Observable<Record<string, number>> {
    return this.http.get<Record<string, number>>(`${environment.apiUrl}/live?source=${source}&target=${target}`, { withCredentials: true });
  }
}
