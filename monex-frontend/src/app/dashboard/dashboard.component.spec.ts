import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { CounterService } from '../shared/services/counter.service';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Currency } from '../shared/models/currency.model';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let counterServiceSpy: jasmine.SpyObj<CounterService>;
  const mockCurrencies: Currency[] = [
    {
      name: 'United States Dollar',
      currencyCode: 'USD'
    },
    {
      name: 'Armenian Dram',
      currencyCode: 'AMD'
    }
  ]

  beforeEach(async () => {
    counterServiceSpy = jasmine.createSpyObj<CounterService>('CounterService', ['getCurrentCount']);
    counterServiceSpy.getCurrentCount.and.returnValue(of(3));
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: CounterService, useValue: counterServiceSpy  },
        provideHttpClient(),
        provideHttpClient()
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchCount', () => {
    it('should fetch current count', () => {
      spyOn(component, 'extractCurrenciesModern').and.returnValue(mockCurrencies);

      component.fetchCount()

      expect(component.currencies).toEqual(mockCurrencies);
      expect(counterServiceSpy.getCurrentCount).toHaveBeenCalled();
      expect(component.count).toBe(3);
      expect(component.extractCurrenciesModern).toHaveBeenCalled();
    })
  })
});
