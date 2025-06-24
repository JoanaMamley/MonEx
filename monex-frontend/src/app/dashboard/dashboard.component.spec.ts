import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { CounterService } from '../shared/services/counter.service';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let counterServiceSpy: jasmine.SpyObj<CounterService>;

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
});
