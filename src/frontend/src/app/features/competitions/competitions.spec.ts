import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Competitions } from './competitions';

describe('Competitions', () => {
  let component: Competitions;
  let fixture: ComponentFixture<Competitions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Competitions]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Competitions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
