import { Component, ElementRef, ViewChild } from '@angular/core';
import { CATEGORIES } from '../../../../shared/data/categories';
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './category-slider.html',
  styleUrl: './category-slider.css',
})
export class CategorySlider {
  
  @ViewChild('categorySlider') slider!: ElementRef;

  categories = CATEGORIES

  constructor(
    private router: Router
  ) {}

  goToCategory(slug: string) {
    this.router.navigate(['/explorar'], {
      queryParams: { categoria: slug }
    });
  }

  scrollLeft() {
    this.slider.nativeElement.scrollBy({ left: -250, behavior: 'smooth' });
  }

  scrollRight() {
    this.slider.nativeElement.scrollBy({ left: 250, behavior: 'smooth' });
  }
}
