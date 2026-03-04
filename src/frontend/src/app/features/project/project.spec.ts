import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Project } from './project';

describe('Project', () => {
  let component: Project;
  let fixture: ComponentFixture<Project>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Project]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Project);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
