export interface StoredImageContract {
  url: string;
  objectKey: string;
  mimeType: string;
  size: number;
}

export interface StorageHealthContract {
  configured: boolean;
  reachable: boolean;
  bucket: string | null;
}

export interface IStorageService {
  uploadImage(userId: string, content: Buffer): Promise<StoredImageContract>;
  health(): Promise<StorageHealthContract>;
}
