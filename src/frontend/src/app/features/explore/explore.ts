import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CATEGORIES } from '../../shared/data/categories';
import { ProjectCard } from '../../shared/components/project-card/project-card';
import { FEATURED_PROJECTS } from '../../shared/data/mock-projects'
import { ProjectCardMode } from '../../shared/components/project-card/project-card';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FormsModule, ProjectCard, MatIconModule, RouterLink],
  templateUrl: './explore.html',
  styleUrl: './explore.css',
})
export class Explore implements OnInit {
  showFilters = false;
  categories = CATEGORIES;
  projects = FEATURED_PROJECTS;
  mode = ProjectCardMode;
  filteredProjects = this.projects;

  selectedCategory: string | null = null;
  selectedCategoryName: string | null = null;
  selectedSort: 'recent' | 'likes' | 'views' = 'recent';
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['categoria'] || null;
      this.updateCategoryName();
      this.applyFilters();
    });
  }

  updateCategoryName() {
    if (!this.selectedCategory) {
      this.selectedCategoryName = null;
      return;
    }

    const category = CATEGORIES.find(
      c => c.slug === this.selectedCategory
    );

    this.selectedCategoryName = category?.name || null;
  }

  applyFilters() {
    let results = this.projects.filter(project => {

      const matchesCategory = this.selectedCategory
        ? project.category === this.selectedCategory
        : true;

      const matchesSearch = project.title
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());

      return matchesCategory && matchesSearch;
    });

    if (this.selectedSort === 'likes') {
      results = results.sort((a, b) => b.likes - a.likes);
    }

    if (this.selectedSort === 'views') {
      results = results.sort((a, b) => b.views - a.views);
    }

    if (this.selectedSort === 'recent') {
      results = results.sort((a, b) =>
        new Date(b.id).getTime() - new Date(a.id).getTime() // posteriormente trocar para data
      );
    }

    this.filteredProjects = results;
  }

  getSortLabel(): string {
    switch (this.selectedSort) {
      case 'likes': return 'mais curtidos';
      case 'views': return 'mais visualizados';
      default: return 'mais recentes';
    }
  }

  selectCategory(slug: string) {
    this.router.navigate([], {
      queryParams: { categoria: slug },
      queryParamsHandling: 'merge'
    });
  }

  clearCategory() {
    this.router.navigate([], {
      queryParams: { categoria: null },
      queryParamsHandling: 'merge'
    });
  }
}
