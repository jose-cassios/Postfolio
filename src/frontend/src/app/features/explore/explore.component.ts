import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProjectCardComponent } from '../../shared/components/project-card/project-card.component';
import { ProjectCardMode } from '../../shared/components/project-card/project-card.component';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from '@angular/router';
import { Project } from '../../shared/models/project';
import { ProjectService } from '../../shared/services/project.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [FormsModule, ProjectCardComponent, MatIconModule, RouterLink],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent implements OnInit {
  showFilters = false;
  categories = [
    { name: 'Full stack', slug: 'FULLSTACK' },
    { name: 'Front-end', slug: 'FRONTEND' },
    { name: 'Back-end', slug: 'BACKEND' },
    { name: 'Design', slug: 'DESIGN' },
    { name: 'Mobile', slug: 'MOBILE' },
    { name: 'Análise de dados', slug: 'DATA_ANALYSIS' },
    { name: 'Outros', slug: 'OTHER' },
  ];
  tools = ['Figma', 'Angular', 'React', 'Vue', 'TypeScript', 'Node.js'];
  projects: Project[] = [];
  mode = ProjectCardMode;
  filteredProjects: Project[] = [];
  isLoading = true;
  errorMessage = '';
  totalProjects = 0;
  totalPages = 0;
  currentPage = 1;

  selectedCategory: string | null = null;
  selectedCategoryName: string | null = null;
  selectedSort: 'newest' | 'likes' | 'appreciates' = 'newest';
  selectedTool: string | null = null;
  searchTerm = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['categoria'] || null;
      this.updateCategoryName();
      this.loadProjects(1);
    });
  }

  updateCategoryName() {
    if (!this.selectedCategory) {
      this.selectedCategoryName = null;
      return;
    }

    const category = this.categories.find(
      c => c.slug === this.selectedCategory
    );

    this.selectedCategoryName = category?.name || null;
  }

  applyFilters() {
    this.loadProjects(1);
  }

  loadProjects(page: number) {
    this.isLoading = true;
    this.errorMessage = '';
    this.projectService.list({
      q: this.searchTerm.trim() || undefined,
      category: this.selectedCategory || undefined,
      tool: this.selectedTool || undefined,
      sort: this.selectedSort,
      page,
      limit: 12,
    }).pipe(finalize(() => this.isLoading = false)).subscribe({
      next: (response) => {
        this.projects = response.data;
        this.filteredProjects = response.data;
        this.currentPage = response.pagination.page;
        this.totalPages = response.pagination.totalPages;
        this.totalProjects = response.pagination.total;
      },
      error: () => this.errorMessage = 'Não foi possível carregar os projetos.',
    });
  }

  getSortLabel(): string {
    switch (this.selectedSort) {
      case 'likes': return 'mais curtidos';
      case 'appreciates': return 'mais apreciados';
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

  selectTool(tool: string | null) {
    this.selectedTool = tool;
    this.loadProjects(1);
  }
}
