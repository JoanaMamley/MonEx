import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTableComponent } from './data-table.component';
import { HistDataService } from '../../shared/services/hist-data.service';
import { AuthService } from '../../shared/services/auth.service';

describe('DataTableComponent', () => {
  let component: DataTableComponent;
  let fixture: ComponentFixture<DataTableComponent>;
  let histDataServiceSpy: jasmine.SpyObj<HistDataService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
    histDataServiceSpy = jasmine.createSpyObj<HistDataService>('HistDataService', ['getHistRateData']);

    await TestBed.configureTestingModule({
      imports: [DataTableComponent],
      providers: [
        { provide: HistDataService, useValue: histDataServiceSpy  },
         {provide: AuthService, useValue: authServiceSpy}
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
