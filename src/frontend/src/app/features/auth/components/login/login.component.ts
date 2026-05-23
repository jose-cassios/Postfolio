import { Component, DestroyRef, inject, signal } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  readonly error = signal<string | null>(null);
  readonly isLoading = signal(false);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  submit(): void {
    if (this.form.invalid || this.isLoading()) return;

    this.error.set(null);
    this.isLoading.set(true);

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password)
      .pipe(
        takeUntilDestroyed(this.destroyRef), 
        finalize(() => this.isLoading.set(false))
      )
      .subscribe({
        next: () => this.navigateToReturnUrl(),
        error: (err) => {
          this.error.set('Email ou senha inválidos')
          console.error(err);
        }
      });
  }

  private navigateToReturnUrl(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? '/';
    this.router.navigateByUrl(returnUrl);
  }
}
