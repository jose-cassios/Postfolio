import { TYPES } from "@compositionRoot/Types";
import { StorageController } from "@storage/api/StorageController";
import { StorageService } from "@storage/application/StorageService";
import { IStorageService } from "@storage/domain/interfaces/IStorageService";
import { Container } from "inversify";

export function storageComposeModule(container: Container): void {
  container
    .bind<StorageService>(TYPES.StorageService)
    .to(StorageService)
    .inSingletonScope();
  container
    .bind<IStorageService>(TYPES.IStorageService)
    .toService(TYPES.StorageService);
  container
    .bind<StorageController>(TYPES.StorageController)
    .to(StorageController)
    .inRequestScope();
}
