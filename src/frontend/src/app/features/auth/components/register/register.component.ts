import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RegisterFormComponent } from '../register-form/register-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RegisterFormComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly router = inject(Router);

  onRegisterSuccess(user: any): void {
    const username = user.username || 'perfil';
    this.router.navigate(['/perfil', username], { queryParams: { edit: true } });
  }
}
