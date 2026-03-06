import { Component, input } from '@angular/core';
import { Project } from '../../models/project';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export enum ProjectCardMode {
  COMPACT = 'compact',
  DETAILED = 'detailed',
}

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.css',
})
export class ProjectCard {
  project = input.required<Project>();
  
  mode = input<ProjectCardMode>(ProjectCardMode.COMPACT);

  ProjectCardMode = ProjectCardMode;
}
