import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { StorageService } from '../../services/storage.service';

const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@Component({
  selector: 'app-image-upload-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload-field.component.html',
  styleUrl: './image-upload-field.component.scss',
})
export class ImageUploadFieldComponent {
  private readonly storage = inject(StorageService);

  @Input() label = 'Imagem';
  @Input() value: string | null = null;
  @Input() compact = false;
  @Output() readonly valueChange = new EventEmitter<string>();

  readonly uploading = signal(false);
  readonly error = signal('');

  selectFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.uploading()) return;

    if (file.size > MAX_IMAGE_SIZE) {
      this.error.set('A imagem deve ter no máximo 8 MB.');
      return;
    }
    if (file.type && !ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      this.error.set('Use uma imagem JPG, PNG, WebP ou GIF.');
      return;
    }

    this.uploading.set(true);
    this.error.set('');
    this.storage.uploadImage(file)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: (image) => this.valueChange.emit(image.url),
        error: (uploadError) => this.error.set(this.errorMessage(uploadError)),
      });
  }

  changeUrl(event: Event): void {
    this.error.set('');
    this.valueChange.emit((event.target as HTMLInputElement).value);
  }

  remove(): void {
    this.error.set('');
    this.valueChange.emit('');
  }

  private errorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.message || 'Não foi possível enviar a imagem.';
    }
    return 'Não foi possível enviar a imagem.';
  }
}
