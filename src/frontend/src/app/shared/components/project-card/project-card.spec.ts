import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCardComponent } from './project-card.component';

describe('ProjectCardComponent', () => {
  let component: ProjectCardComponent;
  let fixture: ComponentFixture<ProjectCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('project', {
      id: 'project-1',
      title: 'Projeto de teste',
      imageUrl: null,
      likes: 0,
      views: 0,
      commentsCount: 0,
      createdAt: new Date(),
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
