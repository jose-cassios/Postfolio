import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreComponent } from './explore.component';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('ExploreComponent', () => {
  let component: ExploreComponent;
  let fixture: ComponentFixture<ExploreComponent>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreComponent);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load and render projects immediately on initialization', async () => {
    fixture.detectChanges();

    const request = http.expectOne((candidate) =>
      candidate.url.endsWith('/project') && candidate.params.get('sort') === 'newest',
    );
    request.flush({
      data: [{
        id: 'project-1',
        name: 'Projeto carregado inicialmente',
        description: 'Descrição',
        category: 'FRONTEND',
        githubLink: null,
        externalLink: null,
        coverImageUrl: null,
        galleryUrls: [],
        tools: ['Angular'],
        tags: [],
        contentBlocks: [],
        contentMarkdown: '',
        status: 'PUBLISHED',
        feedbackAspects: [],
        feedbackQuestion: null,
        seekingFeedback: false,
        currentVersion: 1,
        publishedAt: '2026-08-31T12:00:00.000Z',
        createdAt: '2026-08-31T12:00:00.000Z',
        updatedAt: '2026-08-31T12:00:00.000Z',
        portfolioId: 'portfolio-1',
        metrics: { likes: 3, appreciates: 0, comments: 0, saves: 0 },
      }],
      pagination: { page: 1, limit: 12, total: 1, totalPages: 1 },
    });

    await fixture.whenStable();

    expect(component.filteredProjects()).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Projeto carregado inicialmente');
  });
});
