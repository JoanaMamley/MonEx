import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConverterComponent } from './converter.component';
import { LiveDataService } from '../../shared/services/live-data.service';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
