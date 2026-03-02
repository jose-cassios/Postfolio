import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatIconModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.css',
})
export class Footer {
  email: string = '';

  subscribe() {
    if (!this.email) return;

    console.log('Email cadastrado:', this.email);
    this.email = '';
  }
}
