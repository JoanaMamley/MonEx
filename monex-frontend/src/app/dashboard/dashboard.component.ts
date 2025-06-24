import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConverterComponent } from './converter/converter.component';
import { DataTableComponent } from './data-table/data-table.component';
import { Currency } from '../shared/models/currency.model';
import { CURRENCIES } from '../shared/data/currencies';
import { CounterService } from '../shared/services/counter.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ConverterComponent, DataTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy{
  currencies: Currency[] = [];
  count: number = 0;
  counterSubscription?: Subscription;

  constructor(private counterService: CounterService){}

  ngOnInit() {
    this.fetchCount();
  }

  ngOnDestroy(): void {
    this.counterSubscription?.unsubscribe();
  }

  fetchCount(){
    this.currencies = this.extractCurrenciesModern();

    this.counterSubscription = this.counterService.getCurrentCount().subscribe(count => {
      this.count = count;
    })
  }

  extractCurrenciesModern(): Currency[] {
    let currs = CURRENCIES.currencies
    return Object.keys(currs).map(currencyCode => ({
      currencyCode: currencyCode,
      name: `${currs[currencyCode]} (${currencyCode})`
    }));
  }
}
