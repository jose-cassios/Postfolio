import { CommentsController } from "@comments/api/CommentsController";
import { CommentsService } from "@comments/application/CommentsService";
import { ICommentsRepository } from "@comments/domain/interfaces/ICommentsRepository";
import { ICommentsService } from "@comments/domain/interfaces/ICommentsService";
import { CommentsRepository } from "@comments/infra/database/CommentsRepository";
import { TYPES } from "@compositionRoot/Types";
import { Container } from "inversify";

export function commentsComposerModule(container: Container) {
  container
    .bind<ICommentsRepository>(TYPES.ICommentsRepository)
    .to(CommentsRepository)
    .inRequestScope();

  container
    .bind<ICommentsService>(TYPES.ICommentsService)
    .to(CommentsService)
    .inRequestScope();

  container
    .bind<CommentsController>(TYPES.CommentsController)
    .to(CommentsController)
    .inRequestScope();
}
