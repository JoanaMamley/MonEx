import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { CURRENCIES } from '../../shared/data/currencies';
import { Currency, CurrencyData } from '../../shared/models/currency.model';

@Component({
  selector: 'converter',
  standalone: true,
  imports: [ReactiveFormsModule, Select],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnInit{
  currencies: Currency[] = [];
  formGroup: FormGroup | undefined;


   ngOnInit(): void {
      this.currencies = this.extractCurrenciesModern();
      console.log(this.currencies)
      this.formGroup = new FormGroup({
              selectedCity: new FormControl<CurrencyData | null>(null)
      });
    }

  extractCurrenciesModern(): Currency[] {
    let currs = CURRENCIES.currencies
    return Object.keys(currs).map(currencyCode => ({
      currencyCode: currencyCode,
      name: currs[currencyCode]
    }));
}

}
