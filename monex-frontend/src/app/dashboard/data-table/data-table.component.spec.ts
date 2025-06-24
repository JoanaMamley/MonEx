import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { DataTableComponent } from './data-table.component';
import { HistDataService } from '../../shared/services/hist-data.service';
import { AuthService } from '../../shared/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HistRateData } from '../../shared/models/hist-data.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let histDataServiceSpy: jasmine.SpyObj<HistDataService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    histDataServiceSpy = jasmine.createSpyObj<HistDataService>('HistDataService', ['getHistRateData']);
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [DataTableComponent, NoopAnimationsModule],
      providers: [
        { provide: HistDataService, useValue: histDataServiceSpy  },
         {provide: AuthService, useValue: authServiceSpy},
         { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    component.currencies = [
      { currencyCode: 'USD', name: 'United States Dollar' },
      { currencyCode: 'EUR', name: 'Euro' },
      { currencyCode: 'GBP', name: 'British Pound Sterling' }
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize correctly with USD as default currency', fakeAsync(() => {
    const sampleHistData: HistRateData[] = [
      { id: 1, date: '2025-05-06', currency: 'USD', rate: 1.0 },
      { id: 2, date: '2025-05-06', currency: 'EUR', rate: 0.85 },
      { id: 3, date: '2025-05-06', currency: 'GBP', rate: 0.75 }
    ];
    histDataServiceSpy.getHistRateData.and.returnValue(Promise.resolve(sampleHistData));

    component.ngOnInit();
    tick();

    expect(component.maxDate).toBeInstanceOf(Date);
    expect(component.selectedCurrency.value).toEqual({ currencyCode: 'USD', name: 'United States Dollar' });
    expect(component.dateControl.value).toEqual(new Date(2025, 5, 6));
    expect(component.computedRates).toEqual([
      { id: 1, date: '2025-05-06', currency: 'USD', rate: 1.0, sourceCode: 'USDUSD', name: 'United States Dollar' },
      { id: 2, date: '2025-05-06', currency: 'EUR', rate: 0.85, sourceCode: 'USDEUR', name: 'Euro' },
      { id: 3, date: '2025-05-06', currency: 'GBP', rate: 0.75, sourceCode: 'USDGBP', name: 'British Pound Sterling' }
    ]);
    expect(histDataServiceSpy.getHistRateData).toHaveBeenCalledWith('2025-06-06');
  }));

   it('should compute rates correctly for non-USD currency (EUR)', fakeAsync(() => {
    const sampleHistData: HistRateData[] = [
      { id: 1, date: '2025-05-06', currency: 'USD', rate: 1.0 },
      { id: 2, date: '2025-05-06', currency: 'EUR', rate: 0.85 },
      { id: 3, date: '2025-05-06', currency: 'GBP', rate: 0.75 }
    ];
    histDataServiceSpy.getHistRateData.and.returnValue(Promise.resolve(sampleHistData));

    component.selectedCurrency.setValue({ currencyCode: 'EUR', name: 'Euro' });
    component.dateControl.setValue(new Date(2025, 5, 6));
    component.fetchHistoricalData();
    tick();
    fixture.detectChanges();

    const baseRate = 0.85;
    expect(component.computedRates).toEqual([
      { id: 1, date: '2025-05-06', currency: 'USD', rate: 1.0 / baseRate, sourceCode: 'EURUSD', name: 'United States Dollar' },
      { id: 2, date: '2025-05-06', currency: 'EUR', rate: 0.85 / baseRate, sourceCode: 'EUREUR', name: 'Euro' },
      { id: 3, date: '2025-05-06', currency: 'GBP', rate: 0.75 / baseRate, sourceCode: 'EURGBP', name: 'British Pound Sterling' }
    ]);
    expect(histDataServiceSpy.getHistRateData).toHaveBeenCalledWith('2025-06-06');
  }));

   it('should logout successfully', fakeAsync(() => {
    authServiceSpy.logout.and.returnValue(of('logout success'));

    component.logout();
    tick();
    fixture.detectChanges();

    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(snackBarSpy.open).not.toHaveBeenCalled();
  }));
});
