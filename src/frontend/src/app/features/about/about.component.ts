import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [MatIconModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent {
    constructor(private location: Location) {}

    goBack() {
      this.location.back();
    }
}
