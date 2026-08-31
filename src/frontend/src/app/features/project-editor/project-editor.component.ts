import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  ProjectBlock,
  ProjectCarouselBlock,
  ProjectEditorPayload,
  ProjectStatus,
} from '../../shared/models/project-content';
import { ProjectAppreciation, ProjectService } from '../../shared/services/project.service';
import { AuthService } from '../auth/services/auth.service';
import { ImageUploadFieldComponent } from '../../shared/components/image-upload-field/image-upload-field.component';

type BlockType = ProjectBlock['type'];

@Component({
  selector: 'app-project-editor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    ImageUploadFieldComponent,
  ],
  templateUrl: './project-editor.component.html',
  styleUrl: './project-editor.component.scss',
})
export class ProjectEditorComponent {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly projectService = inject(ProjectService);
  private readonly auth = inject(AuthService);

  readonly projectId = signal<string | null>(null);
  readonly blocks = signal<ProjectBlock[]>([]);
  readonly selectedBlockId = signal<string | null>(null);
  readonly selectedBlock = computed(() =>
    this.blocks().find((block) => block.id === this.selectedBlockId()) ?? null,
  );
  readonly isEditing = computed(() => Boolean(this.projectId()));
  readonly isLoading = signal(false);
  readonly isSaving = signal(false);
  readonly notice = signal('');
  readonly noticeIsError = signal(false);
  readonly invalidVideoIds = signal<string[]>([]);
  readonly feedbackAspects = signal<string[]>([]);
  readonly appreciations = signal<ProjectAppreciation[]>([]);
  readonly selectedAppreciationIds = signal<string[]>([]);

  readonly categories = [
    { value: 'FULLSTACK', label: 'Full stack' },
    { value: 'FRONTEND', label: 'Front-end' },
    { value: 'BACKEND', label: 'Back-end' },
    { value: 'DESIGN', label: 'Design' },
    { value: 'MOBILE', label: 'Mobile' },
    { value: 'DATA_ANALYSIS', label: 'Análise de dados' },
    { value: 'OTHER', label: 'Outro' },
  ] as const;
  readonly feedbackAspectOptions = [
    { value: 'UI', label: 'UI' },
    { value: 'UX', label: 'UX' },
    { value: 'ARCHITECTURE', label: 'Arquitetura' },
    { value: 'CODE', label: 'Código' },
    { value: 'PERFORMANCE', label: 'Performance' },
    { value: 'ACCESSIBILITY', label: 'Acessibilidade' },
    { value: 'ORIGINALITY', label: 'Originalidade' },
    { value: 'DOCUMENTATION', label: 'Documentação' },
  ] as const;

  readonly projectForm = this.fb.nonNullable.group({
    name: ['', [Validators.maxLength(100)]],
    description: ['', [Validators.maxLength(500)]],
    category: ['OTHER'],
    githublink: [''],
    externalLink: [''],
    coverImageUrl: [''],
    tools: [''],
    tags: [''],
    feedbackQuestion: ['', [Validators.maxLength(240)]],
    seekingFeedback: [false],
    changelog: ['', [Validators.maxLength(500)]],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('projectId');
    if (!id) return;

    this.projectId.set(id);
    this.isLoading.set(true);
    this.projectService.getForEditor(id)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (project) => {
          this.projectForm.reset({
            name: project.name,
            description: project.description,
            category: project.category,
            githublink: project.githubLink ?? '',
            externalLink: project.externalLink ?? '',
            coverImageUrl: project.coverImageUrl ?? '',
            tools: project.tools.join(', '),
            tags: project.tags.join(', '),
            feedbackQuestion: project.feedbackQuestion ?? '',
            seekingFeedback: project.seekingFeedback ?? false,
            changelog: '',
          });
          this.feedbackAspects.set(project.feedbackAspects ?? []);
          this.blocks.set(project.contentBlocks ?? []);
          this.selectedBlockId.set(project.contentBlocks?.[0]?.id ?? null);
          this.projectService.getAppreciations(id).subscribe({
            next: (appreciations) => this.appreciations.set(
              appreciations.filter((item) => !item.creditedInVersion && item.status !== 'DISMISSED'),
            ),
          });
        },
        error: () => this.showNotice('Não foi possível abrir este projeto.', true),
      });
  }

  addBlock(type: BlockType): void {
    const id = this.createId();
    const block = this.createBlock(type, id);
    this.blocks.update((blocks) => [...blocks, block]);
    this.selectedBlockId.set(id);
    this.notice.set('');
  }

  selectBlock(id: string): void {
    this.selectedBlockId.set(id);
  }

  selectProjectSettings(): void {
    this.selectedBlockId.set(null);
  }

  updateBlock(id: string, changes: Record<string, unknown>): void {
    this.blocks.update((blocks) =>
      blocks.map((block) => block.id === id
        ? { ...block, ...changes } as ProjectBlock
        : block),
    );
  }

  moveBlock(index: number, direction: -1 | 1): void {
    const target = index + direction;
    if (target < 0 || target >= this.blocks().length) return;
    this.blocks.update((blocks) => {
      const reordered = [...blocks];
      [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
      return reordered;
    });
  }

  removeBlock(id: string): void {
    this.blocks.update((blocks) => blocks.filter((block) => block.id !== id));
    this.invalidVideoIds.update((ids) => ids.filter((item) => item !== id));
    this.selectedBlockId.set(this.blocks()[0]?.id ?? null);
  }

  addCarouselItem(block: ProjectCarouselBlock): void {
    if (block.items.length >= 10) return;
    this.updateBlock(block.id, { items: [...block.items, { url: '', alt: '' }] });
  }

  updateCarouselItem(
    block: ProjectCarouselBlock,
    index: number,
    changes: Partial<ProjectCarouselBlock['items'][number]>,
  ): void {
    const items = block.items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, ...changes } : item,
    );
    this.updateBlock(block.id, { items });
  }

  removeCarouselItem(block: ProjectCarouselBlock, index: number): void {
    this.updateBlock(block.id, {
      items: block.items.filter((_, itemIndex) => itemIndex !== index),
    });
  }

  validateVideo(event: Event, id: string): void {
    const video = event.target as HTMLVideoElement;
    this.invalidVideoIds.update((ids) => {
      const withoutCurrent = ids.filter((item) => item !== id);
      return Number.isFinite(video.duration) && video.duration > 90
        ? [...withoutCurrent, id]
        : withoutCurrent;
    });
  }

  save(status: ProjectStatus): void {
    if (this.isSaving()) return;
    if (status === 'PUBLISHED' && !this.canPublish()) {
      this.projectForm.markAllAsTouched();
      this.showNotice(
        'Para publicar, informe um título e complete ou remova todos os blocos vazios.',
        true,
      );
      return;
    }
    if (
      status === 'PUBLISHED'
      && this.isEditing()
      && this.projectForm.controls.changelog.value.trim().length < 3
    ) {
      this.showNotice('Descreva brevemente o que mudou nesta versão.', true);
      return;
    }

    const payload = this.buildPayload(status);
    const id = this.projectId();
    const request = id
      ? this.projectService.updateProject(id, payload)
      : this.projectService.createProject(payload);

    this.isSaving.set(true);
    this.notice.set('');
    request.pipe(finalize(() => this.isSaving.set(false))).subscribe({
      next: (project) => {
        this.projectId.set(project.id);
        if (status === 'PUBLISHED') {
          this.router.navigate(['/projetos', project.id]);
          return;
        }
        if (!id) {
          this.router.navigate(['/projetos', project.id, 'editar'], { replaceUrl: true });
        }
        this.showNotice('Rascunho salvo.', false);
      },
      error: (error) => this.showNotice(this.errorMessage(error), true),
    });
  }

  cancel(): void {
    const username = this.auth.user()?.username;
    this.router.navigate(username ? ['/perfil', username] : ['/explorar']);
  }

  blockName(type: BlockType): string {
    return ({ TEXT: 'Texto', IMAGE: 'Imagem', VIDEO: 'Vídeo curto', CAROUSEL: 'Carrossel' })[type];
  }

  toggleFeedbackAspect(aspect: string): void {
    this.feedbackAspects.update((selected) => {
      if (selected.includes(aspect)) return selected.filter((item) => item !== aspect);
      return selected.length < 3 ? [...selected, aspect] : selected;
    });
  }

  toggleAppreciationCredit(appreciationId: string): void {
    this.selectedAppreciationIds.update((selected) =>
      selected.includes(appreciationId)
        ? selected.filter((id) => id !== appreciationId)
        : [...selected, appreciationId]
    );
  }

  private canPublish(): boolean {
    if (this.projectForm.controls.name.value.trim().length < 3) return false;
    if (!this.blocks().length || this.invalidVideoIds().length) return false;

    return this.blocks().every((block) => {
      if (block.type === 'TEXT') return Boolean(block.content.trim());
      if (block.type === 'CAROUSEL') {
        return block.items.filter((item) => Boolean(item.url.trim())).length >= 2;
      }
      return Boolean(block.url.trim());
    });
  }

  private buildPayload(status: ProjectStatus): ProjectEditorPayload {
    const values = this.projectForm.getRawValue();
    const contentBlocks = this.normalizeBlockUrls(this.blocks());
    return {
      name: values.name.trim(),
      description: values.description.trim(),
      category: values.category,
      githublink: this.normalizeOptionalUrl(values.githublink),
      externalLink: this.normalizeOptionalUrl(values.externalLink),
      coverImageUrl: this.normalizeOptionalUrl(values.coverImageUrl),
      galleryUrls: this.collectGalleryUrls(contentBlocks),
      tools: this.splitValues(values.tools),
      tags: this.splitValues(values.tags),
      contentBlocks,
      status,
      feedbackAspects: this.feedbackAspects(),
      feedbackQuestion: values.feedbackQuestion.trim() || null,
      seekingFeedback: values.seekingFeedback,
      ...(this.isEditing() && status === 'PUBLISHED'
        ? {
            changelog: values.changelog.trim(),
            appreciationIds: this.selectedAppreciationIds(),
          }
        : {}),
    };
  }

  private normalizeBlockUrls(blocks: ProjectBlock[]): ProjectBlock[] {
    return blocks.map((block) => {
      if (block.type === 'IMAGE') {
        return { ...block, url: this.normalizeOptionalUrl(block.url) ?? '' };
      }
      if (block.type === 'VIDEO') {
        return {
          ...block,
          url: this.normalizeOptionalUrl(block.url) ?? '',
          posterUrl: this.normalizeOptionalUrl(block.posterUrl ?? ''),
        };
      }
      if (block.type === 'CAROUSEL') {
        return {
          ...block,
          items: block.items.map((item) => ({
            ...item,
            url: this.normalizeOptionalUrl(item.url) ?? '',
          })),
        };
      }
      return block;
    });
  }

  private collectGalleryUrls(blocks: ProjectBlock[]): string[] {
    const urls = blocks.flatMap((block) => {
      if (block.type === 'IMAGE') return block.url ? [block.url] : [];
      if (block.type === 'CAROUSEL') return block.items.map((item) => item.url).filter(Boolean);
      return [];
    });
    return [...new Set(urls)].slice(0, 10);
  }

  private createBlock(type: BlockType, id: string): ProjectBlock {
    switch (type) {
      case 'TEXT':
        return {
          id, type, content: '', variant: 'BODY', alignment: 'LEFT', bold: false, italic: false,
        };
      case 'IMAGE':
        return { id, type, url: '', alt: '', caption: '', width: 'WIDE' };
      case 'VIDEO':
        return { id, type, url: '', posterUrl: null, caption: '', width: 'WIDE' };
      case 'CAROUSEL':
        return {
          id,
          type,
          items: [{ url: '', alt: '' }, { url: '', alt: '' }],
          caption: '',
          width: 'WIDE',
        };
    }
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `block-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  private normalizeOptionalUrl(value: string): string | null {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  private splitValues(value: string): string[] {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }

  private showNotice(message: string, error: boolean): void {
    this.notice.set(message);
    this.noticeIsError.set(error);
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.details?.issues?.[0]?.message
        || error.error?.message
        || 'Não foi possível salvar o projeto.';
    }
    return 'Não foi possível salvar o projeto.';
  }
}
