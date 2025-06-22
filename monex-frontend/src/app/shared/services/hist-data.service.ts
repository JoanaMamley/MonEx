import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HistRateData } from '../models/hist-data.model';
import { environment } from '../environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistDataService {

  constructor(private http: HttpClient) { }

  getHistRateData(date: string): Promise<HistRateData[]> {
    return lastValueFrom(this.http.get<HistRateData[]>(`${environment.apiUrl}/historical?date=${date}`));
  }
}
