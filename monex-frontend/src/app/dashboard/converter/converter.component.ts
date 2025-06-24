import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { Currency } from '../../shared/models/currency.model';
import { debounceTime, distinctUntilChanged, Subject, Subscription, takeUntil } from 'rxjs';
import { LiveDataService } from '../../shared/services/live-data.service';
import { CommonModule } from '@angular/common';

export interface ConversionData {
  source: Currency | null;
  target: Currency | null;
  amount: number | null;
}

@Component({
  selector: 'converter',
  standalone: true,
  imports: [ReactiveFormsModule, Select, CommonModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.scss'
})
export class ConverterComponent implements OnInit, OnDestroy{
  @Input({required: true}) currencies!: Currency[];
  result: number = 0.00
  subscriptions: Subscription[] = [];
  destroy$ = new Subject<void>();
  targetCode: string = "USD";
  conversionForm?: FormGroup;

  constructor(private liveDataService: LiveDataService){}


   ngOnInit(): void {
      this.conversionForm = new FormGroup({
        source: new FormControl<Currency | null>(null),
        target: new FormControl<Currency | null>(null),
        amount: new FormControl<number | null>(null)
      });

      this.conversionForm.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe((value: ConversionData) => {
        const source: string | undefined = value.source?.currencyCode
        const target: string | undefined = value.target?.currencyCode;
        const amount: number | null = value.amount;
        if (source && target && amount) {
          this.liveDataService.getLiveCurrencyRateData(source, target).pipe(takeUntil(this.destroy$))
          .subscribe(exchangeData => {
            this.convertAmout(exchangeData, source, target, amount)
          })
        }
      })

    }

    convertAmout(exchangeRates: Record<string, number>, source: string, target: string, amount: number) {
      if (source !== "USD" && target !== "USD") {
        this.result = exchangeRates["USD"+target] / exchangeRates["USD"+source] * amount;
        this.targetCode = target;
      }
    }

    ngOnDestroy(): void {
      this.destroy$.next();
      this.destroy$.complete();
    }
}
