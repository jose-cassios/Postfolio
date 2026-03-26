import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySliderComponent } from './category-slider.component';

describe('CategorySliderComponent', () => {
  let component: CategorySliderComponent;
  let fixture: ComponentFixture<CategorySliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySliderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySliderComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
