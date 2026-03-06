import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [MatIconModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About {
    constructor(private location: Location) {}

    goBack() {
      this.location.back();
    }
}
