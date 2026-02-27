import { Component, ElementRef, ViewChild } from '@angular/core';
import { CATEGORIES } from '../../../../shared/data/categories';
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-category-slider',
  imports: [MatIconModule],
  templateUrl: './category-slider.html',
  styleUrl: './category-slider.css',
})
export class CategorySlider {
  
  @ViewChild('categorySlider') slider!: ElementRef;

  categories = CATEGORIES

  scrollLeft() {
    this.slider.nativeElement.scrollBy({ left: -250, behavior: 'smooth' });
  }

  scrollRight() {
    this.slider.nativeElement.scrollBy({ left: 250, behavior: 'smooth' });
  }
}
