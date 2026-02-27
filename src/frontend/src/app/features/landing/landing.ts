import { Component } from '@angular/core';
import { Hero } from "./components/hero/hero";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Hero],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
