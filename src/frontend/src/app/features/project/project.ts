import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ProjectDetails } from '../../shared/models/project-details';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FEATURED_PROJECTS } from '../../shared/data/mock-projects';

@Component({
  selector: 'app-project',
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './project.html',
  styleUrl: './project.css',
})
export class Project {
  private route = inject(ActivatedRoute);

  project = signal<ProjectDetails | null>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');

    const foundProject = FEATURED_PROJECTS.find(p => p.slug === slug);
    this.project.set(foundProject || null);

  }
}
