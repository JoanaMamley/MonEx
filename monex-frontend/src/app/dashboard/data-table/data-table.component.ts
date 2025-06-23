import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { Currency } from '../../shared/models/currency.model';
import { CURRENCIES } from '../../shared/data/currencies';
import { DatePicker } from 'primeng/datepicker';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { HistDataService } from '../../shared/services/hist-data.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HistRateData, HistRateDataWithSource } from '../../shared/models/hist-data.model';
import { AuthService } from '../../shared/services/auth.service';
import { lastValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'data-table',
  standalone: true,
  imports: [TableModule, CommonModule, DatePicker, Select, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent implements OnInit {
  dateControl: FormControl<Date | null> = new FormControl<Date | null>(null);
  selectedCurrency = new FormControl<Currency | null>(null)
  @Input({required: true}) currencies!: Currency[];
  computedRates: HistRateDataWithSource[] = [];
  maxDate: Date | undefined;

  constructor(private histDataService: HistDataService, private snackBar: MatSnackBar, private authService: AuthService){}

  async ngOnInit(): Promise<void> {
    this.maxDate = new Date();

    this.selectedCurrency.setValue({
      currencyCode: "USD",
      name: "United States Dollar"
    })
    this.dateControl.setValue(new Date(2025, 5, 6));
    await this.fetchHistoricalData();
  }

  async logout() {
    await lastValueFrom(this.authService.logout()).catch((error) => {
      console.error('Logout failed:', error);
      this.snackBar.open('logout failed', 'Close', {
              duration: 3000,
      });
    }
    );
  }

  private computeTableData(data: HistRateData[]){
    const baseRate = data.find(histItem => histItem.currency == this.selectedCurrency.value!.currencyCode);
    if (!baseRate) {
      this.snackBar.open('Base currency could not be found for that date', 'Close', {
              duration: 3000,
      });
    }
    else {
      this.computedRates = data.map(histItem => ({
        ...histItem,
        sourceCode: baseRate.currency + histItem.currency,
        rate: histItem.rate / baseRate.rate,
        name: CURRENCIES.currencies[histItem.currency]
      }))
    }
  }

  private computeTableDataBaseUSD(data: HistRateData[]){
    this.computedRates = data.map(histItem => ({
        ...histItem,
        sourceCode: "USD" + histItem.currency,
        rate: histItem.rate,
        name: CURRENCIES.currencies[histItem.currency]
    }))
  }

  async fetchHistoricalData(){
    if (!this.dateControl.value || !this.selectedCurrency.value){
      this.snackBar.open('No date or base currency provided', 'Close', {
              duration: 3000,
      });
    }
    else {
      const data = await this.histDataService.getHistRateData(this.dateControl.value.toISOString().slice(0, 10));
      if (this.selectedCurrency.value.currencyCode === "USD") {
        this.computeTableDataBaseUSD(data);
      }
      else {
        this.computeTableData(data);
      }
    }
  }
}
