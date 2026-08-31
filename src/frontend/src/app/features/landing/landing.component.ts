import { Component } from '@angular/core';
import { HeroComponent } from "./components/hero/hero.component";
import { MatIconModule } from '@angular/material/icon';
import { CategorySliderComponent } from "./components/category-slider/category-slider.component";
import { ProjectCardComponent } from "../../shared/components/project-card/project-card.component";
import { RouterLink } from "@angular/router";
import { ProjectCardMode } from '../../shared/components/project-card/project-card.component';
import { Project } from '../../shared/models/project';
import { ProjectService } from '../../shared/services/project.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroComponent, MatIconModule, CategorySliderComponent, ProjectCardComponent, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss',
})
export class LandingComponent {
  projects: Project[] = [];
  mode = ProjectCardMode;

  constructor(private projectService: ProjectService) {
    this.projectService.list({ sort: 'feedback', limit: 6 }).subscribe({
      next: (response) => this.projects = response.data,
    });
  }
}
