import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss',
})
export class FormInputComponent {
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() control!: FormControl;
  @Input() icon?: string;

  get hasError(): boolean {
    return this.control?.invalid && this.control?.touched;
  }

  get errorMessage(): string {
    const errors = this.control?.errors;
    
    if (!errors) return '';
    
    if (errors['required']) return `${this.label} é obrigatório`;
    if (errors['email']) return 'Por favor, insira um e-mail válido';
    if (errors['minlength']) return `${this.label} deve ter no mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `${this.label} não deve exceder ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return `${this.label} contém um formato inválido`;
    
    return 'Campo inválido';
  }
}
