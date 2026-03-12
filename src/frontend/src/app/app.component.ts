import { Component, computed, inject, signal } from '@angular/core';
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  protected readonly title = signal('frontend');

  private router = inject(Router);

  isAuthRoute = computed(() =>
    this.router.url.startsWith('/login')
  );
}
