import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionsComponent } from './competitions.component';

describe('CompetitionsComponent', () => {
  let component: CompetitionsComponent;
  let fixture: ComponentFixture<CompetitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompetitionsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
