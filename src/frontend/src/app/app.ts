import { Component, signal } from '@angular/core';
import { Header } from "./layout/header/header";
import { Landing } from "./features/landing/landing";

@Component({
  selector: 'app-root',
  imports: [Header, Landing],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
