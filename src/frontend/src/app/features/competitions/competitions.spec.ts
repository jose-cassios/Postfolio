import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetitionsComponent } from './competitions.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('CompetitionsComponent', () => {
  let component: CompetitionsComponent;
  let fixture: ComponentFixture<CompetitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompetitionsComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
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
