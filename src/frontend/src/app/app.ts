import { Component, computed, inject, signal } from '@angular/core';
import { Header } from "./layout/header/header";
import { Footer } from "./layout/footer/footer";
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [Header, Footer, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');

  private router = inject(Router);

  isAuthRoute = computed(() =>
    this.router.url.startsWith('/login')
  );
}
