import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Currency, CurrencyData, CurrencyWithRate } from '../../shared/models/currency.model';
import { CURRENCIES } from '../../shared/data/currencies';
import { HistoricalDummyData } from '../../shared/data/hist-dummy';
import { DatePicker } from 'primeng/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [TableModule, CommonModule, DatePicker, Select, ReactiveFormsModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit {
  rates: CurrencyWithRate[] = [];
  dateControl: FormControl<Date | null> = new FormControl<Date | null>(null);
  selectedCurrency = new FormControl<Currency | null>(null)
  @Input({required: true}) currencies!: Currency[];
  

    ngOnInit(): void {
      this.extractTableData();
      this.dateControl.valueChanges.subscribe(val => {
        console.log(val?.toISOString().slice(0, 10));
      })
    }

    extractTableData() {
      let currencies = CURRENCIES.currencies;
      let histData = HistoricalDummyData.quotes;
      let source = HistoricalDummyData.source;


      for (const sourceCode in histData) {
        let rate = histData[sourceCode];
        let currencyCode = sourceCode.replace(source, '');
        let name = currencies[currencyCode];

        this.rates.push({
          sourceCode: sourceCode,
          name: name,
          rate: rate,
          currencyCode: currencyCode
        })
      }


    }
}
