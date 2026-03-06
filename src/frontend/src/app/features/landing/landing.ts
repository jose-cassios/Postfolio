import { Component } from '@angular/core';
import { Hero } from "./components/hero/hero";
import { MatIconModule } from '@angular/material/icon';
import { CategorySlider } from "./components/category-slider/category-slider";
import { ProjectCard } from "../../shared/components/project-card/project-card";
import { FEATURED_PROJECTS } from '../../shared/data/mock-projects';
import { RouterLink } from "@angular/router";
import { ProjectCardMode } from '../../shared/components/project-card/project-card';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [Hero, MatIconModule, CategorySlider, ProjectCard, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  projects = FEATURED_PROJECTS.slice(0, 6);
  mode = ProjectCardMode;
}
