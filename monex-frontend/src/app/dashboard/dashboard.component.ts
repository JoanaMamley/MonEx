import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ConverterComponent } from './converter/converter.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, InputTextModule, ConverterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  formGroup: FormGroup | undefined;

    ngOnInit() {
        this.formGroup = new FormGroup({
            text: new FormControl<string | null>(null)
        });
    }
}
