import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategorySlider } from './category-slider';

describe('CategorySlider', () => {
  let component: CategorySlider;
  let fixture: ComponentFixture<CategorySlider>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategorySlider]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategorySlider);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
