import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../features/auth/services/auth.service';

export interface StoredImage {
  url: string;
  objectKey: string;
  mimeType: string;
  size: number;
}

@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  uploadImage(file: File) {
    const body = new FormData();
    body.append('image', file, file.name);
    return this.api.post<StoredImage>('storage/images', body, this.auth.authOptions());
  }
}
