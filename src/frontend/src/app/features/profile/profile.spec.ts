import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const params = new BehaviorSubject(convertToParamMap({}));
  const queryParams = new BehaviorSubject(convertToParamMap({}));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: params.asObservable(),
            queryParamMap: queryParams.asObservable(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('keeps community details in the secondary statistics area', () => {
    component.isLoading.set(false);
    component.profile.set({
      id: 'user-1',
      username: 'ana',
      usertype: 'USER',
      reputation: {
        creator: {
          rank: 'F', xp: 3, nextRank: 'F+', xpRequired: 20, xpRemaining: 17,
          progressPercent: 15, mission: 'Publique 1 projeto', missionCurrentValue: 0,
          missionRequiredValue: 1, missionCompleted: false,
        },
        contributor: {
          rank: 'F', xp: 7, nextRank: 'F+', xpRequired: 20, xpRemaining: 13,
          progressPercent: 35, mission: 'Envie 3 Postmarks', missionCurrentValue: 0,
          missionRequiredValue: 3, missionCompleted: false,
        },
        evidence: {
          publishedProjects: 2,
          versionsCreated: 4,
          postmarksSent: 5,
          usefulFeedbacks: 2,
          appliedSuggestions: 1,
          recognizedContributions: 1,
        },
      },
    });
    fixture.detectChanges();

    const content = fixture.nativeElement.textContent;
    const statistics = fixture.nativeElement.querySelector('details.statistics-panel');

    expect(content).not.toContain('Trajetória verificável');
    expect(content).not.toContain('Evidências da comunidade');
    expect(content).not.toContain('Versões criadas');
    expect(statistics).toBeTruthy();
    expect(statistics.open).toBe(false);
    expect(statistics.textContent).toContain('Postmarks enviados');
  });
});
