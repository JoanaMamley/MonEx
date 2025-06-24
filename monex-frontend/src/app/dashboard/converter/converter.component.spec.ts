import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ConverterComponent } from './converter.component';
import { LiveDataService } from '../../shared/services/live-data.service';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

describe('ConverterComponent', () => {
  let component: ConverterComponent;
  let fixture: ComponentFixture<ConverterComponent>;
  let liveDataServiceSpy: jasmine.SpyObj<LiveDataService>;

  beforeEach(async () => {
    liveDataServiceSpy =  jasmine.createSpyObj<LiveDataService>('LiveDataService', ['getLiveCurrencyRateData']);
    await TestBed.configureTestingModule({
      imports: [ConverterComponent],
      providers: [
        { provide: LiveDataService, useValue: liveDataServiceSpy  }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConverterComponent);
    component = fixture.componentInstance;
    component.currencies = [
      { currencyCode: 'USD', name: 'United States Dollar' },
      { currencyCode: 'EUR', name: 'Euro' },
      { currencyCode: 'GBP', name: 'British Pound' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

   it('should initialize the form with source, target, and amount controls', () => {
    expect(component.conversionForm).toBeDefined();
    expect(component.conversionForm?.get('source')).toBeInstanceOf(FormControl);
    expect(component.conversionForm?.get('target')).toBeInstanceOf(FormControl);
    expect(component.conversionForm?.get('amount')).toBeInstanceOf(FormControl);
  });

   it('should call liveDataService.getLiveCurrencyRateData when form values change', fakeAsync(() => {
    const sourceCurrency = component.currencies[1];
    const targetCurrency = component.currencies[2];
    const amount = 100;

    component.conversionForm?.setValue({
      source: sourceCurrency,
      target: targetCurrency,
      amount: amount
    });
    liveDataServiceSpy.getLiveCurrencyRateData.and.returnValue(of({
      "USDEUR": 0.867699,
      "USDGBP": 1.541307
    }))
    fixture.detectChanges();

    tick(500);

    expect(liveDataServiceSpy.getLiveCurrencyRateData).toHaveBeenCalledWith(sourceCurrency.currencyCode, targetCurrency.currencyCode);
  }));

  it('should update result when service returns exchange rates and both source and target are not USD', fakeAsync(() => {
    const sourceCurrency = component.currencies[1]; // EUR
    const targetCurrency = component.currencies[2]; // GBP
    const amount = 100;
    const exchangeRates = {
      "USDEUR": 0.85,
      "USDGBP": 0.75
    };

    liveDataServiceSpy.getLiveCurrencyRateData.and.returnValue(of(exchangeRates));
    component.conversionForm?.setValue({
      source: sourceCurrency,
      target: targetCurrency,
      amount: amount
    });

    tick(500); // Wait for debounce
    fixture.detectChanges();

    const expectedResult = (0.75 / 0.85) * 100;
    expect(component.result).toBeCloseTo(expectedResult, 2);
    expect(component.targetCode).toBe('GBP');
  }));

    it('should not update result if source is USD', fakeAsync(() => {
    const sourceCurrency = component.currencies[0]; // USD
    const targetCurrency = component.currencies[1]; // EUR
    const amount = 100;
    const exchangeRates = {
      "USDEUR": 0.85
    };

    liveDataServiceSpy.getLiveCurrencyRateData.and.returnValue(of(exchangeRates));
    component.conversionForm?.setValue({
      source: sourceCurrency,
      target: targetCurrency,
      amount: amount
    });

    tick(500); // Wait for debounce
    fixture.detectChanges();

    expect(component.result).toBe(0.00);
  }));


   it('should not update result if target is USD', fakeAsync(() => {
    const sourceCurrency = component.currencies[1]; // EUR
    const targetCurrency = component.currencies[0]; // USD
    const amount = 100;
    const exchangeRates = {
      "USDEUR": 0.85
    };

    liveDataServiceSpy.getLiveCurrencyRateData.and.returnValue(of(exchangeRates));
    component.conversionForm?.setValue({
      source: sourceCurrency,
      target: targetCurrency,
      amount: amount
    });

    tick(500); // Wait for debounce
    fixture.detectChanges();

    expect(component.result).toBe(0.00);
  }));

   it('should not call service if amount is 0', fakeAsync(() => {
    const sourceCurrency = component.currencies[1]; // EUR
    const targetCurrency = component.currencies[2]; // GBP

    component.conversionForm?.setValue({
      source: sourceCurrency,
      target: targetCurrency,
      amount: 0
    });

    tick(500);
    expect(liveDataServiceSpy.getLiveCurrencyRateData).not.toHaveBeenCalled();
  }));

    it('should not call service if amount is null', fakeAsync(() => {
    const sourceCurrency = component.currencies[1]; // EUR
    const targetCurrency = component.currencies[2]; // GBP

    component.conversionForm?.setValue({
      source: sourceCurrency,
      target: targetCurrency,
      amount: null
    });

    tick(500);
    expect(liveDataServiceSpy.getLiveCurrencyRateData).not.toHaveBeenCalled();
  }));

   it('should not call service if source is null', fakeAsync(() => {
    const targetCurrency = component.currencies[2]; // GBP

    component.conversionForm?.setValue({
      source: null,
      target: targetCurrency,
      amount: 100
    });

    tick(500);
    expect(liveDataServiceSpy.getLiveCurrencyRateData).not.toHaveBeenCalled();
  }));

   it('should not call service if target is null', fakeAsync(() => {
    const sourceCurrency = component.currencies[1]; // EUR

    component.conversionForm?.setValue({
      source: sourceCurrency,
      target: null,
      amount: 100
    });

    tick(500);
    expect(liveDataServiceSpy.getLiveCurrencyRateData).not.toHaveBeenCalled();
  }));

    it('should debounce form value changes', fakeAsync(() => {
    const sourceCurrency = component.currencies[1]; // EUR
    const targetCurrency = component.currencies[2]; // GBP
    const amount = 100;
    liveDataServiceSpy.getLiveCurrencyRateData.and.returnValue(of({
      "USDEUR": 0.867699,
      "USDGBP": 1.541307
    }))

    component.conversionForm?.patchValue({ source: sourceCurrency });
    tick(100);
    component.conversionForm?.patchValue({ target: targetCurrency });
    tick(100);
    component.conversionForm?.patchValue({ amount: amount });
    tick(500); // After last change

    expect(liveDataServiceSpy.getLiveCurrencyRateData).toHaveBeenCalledTimes(1);
    expect(liveDataServiceSpy.getLiveCurrencyRateData).toHaveBeenCalledWith(sourceCurrency.currencyCode, targetCurrency.currencyCode);
  }));

   it('should unsubscribe on destroy', () => {
    spyOn(component.destroy$, 'next');
    spyOn(component.destroy$, 'complete');

    component.ngOnDestroy();

    expect(component.destroy$.next).toHaveBeenCalled();
    expect(component.destroy$.complete).toHaveBeenCalled();
  });
});
