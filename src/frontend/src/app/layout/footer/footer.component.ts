import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, FormsModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  email: string = '';

  subscribe() {
    if (!this.email) return;

    console.log('Email cadastrado:', this.email);
    this.email = '';
  }
}
