import { Component } from '@angular/core';
import { Hero } from "./components/hero/hero";
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Hero, MatIconModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
