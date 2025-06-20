import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConverterComponent } from './converter/converter.component';
import { DataTableComponent } from './data-table/data-table.component';
import { Currency } from '../shared/models/currency.model';
import { CURRENCIES } from '../shared/data/currencies';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ConverterComponent, DataTableComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  currencies: Currency[] = [];
  formGroup: FormGroup | undefined;

    ngOnInit() {
      this.currencies = this.extractCurrenciesModern();
        this.formGroup = new FormGroup({
            text: new FormControl<string | null>(null)
        });
    }

    extractCurrenciesModern(): Currency[] {
      let currs = CURRENCIES.currencies
      return Object.keys(currs).map(currencyCode => ({
        currencyCode: currencyCode,
        name: `${currs[currencyCode]} (${currencyCode})`
      }));
  }
}
