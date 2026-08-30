import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { ProjectCardComponent, ProjectCardMode } from '../../shared/components/project-card/project-card.component';
import { Project } from '../../shared/models/project';
import { ProjectService } from '../../shared/services/project.service';

@Component({
  selector: 'app-saved',
  imports: [ProjectCardComponent, RouterLink],
  template: `
    <main class="saved-page">
      <header><span>Sua coleção privada</span><h1>Projetos salvos</h1><p>Reveja as referências que você separou.</p></header>
      @if (loading()) { <p class="state">Carregando projetos...</p> }
      @else if (error()) { <p class="state">{{ error() }}</p> }
      @else if (!projects().length) { <p class="state">Você ainda não salvou projetos. <a routerLink="/explorar">Explorar agora</a></p> }
      @else { <div class="grid">@for (project of projects(); track project.id) { <app-project-card [routerLink]="['/projetos', project.id]" [project]="project" [mode]="mode.DETAILED" /> }</div> }
    </main>
  `,
  styles: [`
    .saved-page { max-width: 1100px; margin: 0 auto; padding: 64px 24px 96px; }
    header { margin-bottom: 32px; } header span { color: #7b2ff7; font-weight: 700; } header h1 { margin: 8px 0; }
    header p, .state { color: #667085; } .state { padding: 28px 0; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 32px 22px; }
  `],
})
export class SavedComponent {
  private readonly service = inject(ProjectService);
  readonly projects = signal<Project[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly mode = ProjectCardMode;

  ngOnInit() {
    this.service.getSavedProjects().pipe(finalize(() => this.loading.set(false))).subscribe({
      next: (projects) => this.projects.set(projects),
      error: () => this.error.set('Não foi possível carregar seus projetos salvos.'),
    });
  }
}
