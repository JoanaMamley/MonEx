import { Component, Input, OnInit } from '@angular/core';
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
  @Input({required: true}) currencies!: Currency[];
  formGroup: FormGroup | undefined;


   ngOnInit(): void {
      this.formGroup = new FormGroup({
              selectedCity: new FormControl<CurrencyData | null>(null)
      });
    }

  

}
