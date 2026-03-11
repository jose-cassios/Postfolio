import { Component } from '@angular/core';
import { HeroComponent } from "./components/hero/hero.component";
import { MatIconModule } from '@angular/material/icon';
import { CategorySliderComponent } from "./components/category-slider/category-slider.component";
import { ProjectCardComponent } from "../../shared/components/project-card/project-card.component";
import { FEATURED_PROJECTS } from '../../shared/data/mock-projects';
import { RouterLink } from "@angular/router";
import { ProjectCardMode } from '../../shared/components/project-card/project-card.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeroComponent, MatIconModule, CategorySliderComponent, ProjectCardComponent, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css',
})
export class LandingComponent {
  projects = FEATURED_PROJECTS.slice(0, 6);
  mode = ProjectCardMode;
}
