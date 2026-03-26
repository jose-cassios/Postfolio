import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaveComponent } from './wave.component';

describe('WaveComponent', () => {
  let component: WaveComponent;
  let fixture: ComponentFixture<WaveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaveComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
