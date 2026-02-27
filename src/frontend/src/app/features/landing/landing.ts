import { Component, ElementRef, ViewChild } from '@angular/core';
import { Hero } from "./components/hero/hero";
import { MatIconModule } from '@angular/material/icon';
import { CategorySlider } from "./components/category-slider/category-slider";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Hero, MatIconModule, CategorySlider],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

}
