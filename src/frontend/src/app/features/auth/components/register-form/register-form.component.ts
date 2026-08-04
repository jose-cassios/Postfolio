import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormInputComponent } from '../form-input/form-input.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormInputComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly error = signal<string | null>(null);
  readonly isLoading = signal(false);
  readonly registerSuccess = output<any>();

  readonly form = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    usertype: ['USER' as 'USER' | 'MODERATOR' | 'ADMIN', [Validators.required]],
  }, {
    validators: this.passwordMatchValidator,
  });

  private passwordMatchValidator(group: any) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  submit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.error.set(null);
    this.isLoading.set(true);

    const rawValues = this.form.getRawValue();
    const { username, email, password } = rawValues;
    const usertype = rawValues.usertype as 'USER' | 'MODERATOR' | 'ADMIN';

    this.auth.register({ username, email, password, usertype })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: (user) => {
          this.registerSuccess.emit(user);
        },
        error: (err) => {
          console.error('Erro ao registrar:', err);
          this.error.set('Erro ao criar a conta. Tente novamente.');
        }
      });
  }

  get passwordMismatch(): boolean {
    return this.form.hasError('passwordMismatch') && 
           this.form.get('confirmPassword')?.touched || false;
  }
}
