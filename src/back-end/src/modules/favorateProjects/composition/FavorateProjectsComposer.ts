import { TYPES } from "@compositionRoot/Types";
import { FavorateProjectsController } from "@favorateProjects/api/FavorateProjectsController";
import { FavorateProjectsService } from "@favorateProjects/application/FavorateProjectsService";
import { FavorateProjectsPort } from "@favorateProjects/domain/interfaces/FavorateProjectsPort";
import { IFavorateProjectsRepository } from "@favorateProjects/domain/interfaces/IFavorateProjectsRepository";
import { IFavorateProjectsService } from "@favorateProjects/domain/interfaces/IFavorateProjectsService";
import { FavorateProjectsRepository } from "@favorateProjects/infra/database/FavorateProjectsRepository";
import { FavorateProjectsAdapter } from "@favorateProjects/infra/FavorateProjectsAdapter";
import { Container } from "inversify";

export function favorateProjectsComposer(container: Container) {
  container
    .bind<IFavorateProjectsRepository>(TYPES.IFavorateProjectsRepository)
    .to(FavorateProjectsRepository)
    .inRequestScope();

  container
    .bind<IFavorateProjectsService>(TYPES.IFavorateProjectsService)
    .to(FavorateProjectsService)
    .inRequestScope();

  container
    .bind<FavorateProjectsPort>(TYPES.FavorateProjectsPort)
    .to(FavorateProjectsAdapter)
    .inRequestScope();

  container
    .bind<FavorateProjectsController>(TYPES.FavorateProjectsController)
    .to(FavorateProjectsController)
    .inRequestScope();
}
