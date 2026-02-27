import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wave } from './wave';

describe('Wave', () => {
  let component: Wave;
  let fixture: ComponentFixture<Wave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wave);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
