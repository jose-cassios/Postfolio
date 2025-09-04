import { FastifyInstance } from "fastify";
import { Container } from "inversify";
import "reflect-metadata";

import { TYPES } from "@compositionRoot/Types";
import configureErrorHandling from "@infrastructure/fastify/ConfigureErrorHandling";

// Controladores
import { UserController } from "@user/api/UserController";
import { PortfolioController } from "@portfolio/api/PortfolioController";
import { WorkController } from "@project/api/ProjectController";
import { CompetitionController } from "@competition/api/CompetitionController";
// import { ChatController } from "@chat/api/ChatController";
import { EmailController } from "@email/api/EmailController";
import { RatingController } from "@rating/api/RatingController";
import { FavorateProjectsController } from "@favorateProjects/api/FavorateProjectsController";
import { CommentsController } from "@comments/api/CommentsController";

// Rotas
import { UserRoute } from "@user/api/UserRoute";
import { PortfolioRoute } from "@portfolio/api/PortfolioRoute";
import { ProjectRoute } from "@project/api/ProjectRoute";
import { CompetitionRoute } from "@competition/api/CompetitionRoute";
// import { ChatRoute } from "@chat/api/ChatRoute";
import { EmailRoute } from "@email/api/EmailRoute";
import { RatingRoute } from "@rating/api/RatingRoute";
import { FavorateProjectsRoute } from "@favorateProjects/api/FavorateProjectsRoutes";
import { CommentsRoute } from "@comments/api/CommentsRoutes";

// Handlers
import { PortfolioUserCreatedHandler } from "@portfolio/handler/PortfolioUserCreatedHandler";
import { EmailUserCreatedHandler } from "@email/handler/EmailUserCreatedHandler";
import { EmailUserUpdateHandler } from "@email/handler/EmailUserUpdateHandler";

// Composition
import { userComposeModule } from "@user/composition/UserComposer";
import { portfolioComposeModule } from "@portfolio/composition/PortfolioComposer";
import { competitionComposeModule } from "@competition/composition/CompetitionComposer";
// import { chatComposerModule } from "@chat/composition/ChatComposer";
import { emailComposerModuler } from "@email/composition/EmailComposer";
import { projectComposeModule } from "@project/composition/ProjectComposer";
import { ratingComposerModule } from "@rating/composition/RatingComposer";
import { projectCompDetailsComposeModule } from "@projectCompDetails/composition/projectCompDetailsComposer";
import { favorateProjectsComposer } from "@favorateProjects/composition/FavorateProjectsComposer";
import { commentsComposerModule } from "@comments/composition/CommentsComposer";
import { postMetricsComposeModule } from "@postMetrics/composition/PostMetricsComposer";

const container = new Container();

userComposeModule(container);
portfolioComposeModule(container);
projectComposeModule(container);
competitionComposeModule(container);
// chatComposerModule(container);
emailComposerModuler(container);
ratingComposerModule(container);
projectCompDetailsComposeModule(container);
favorateProjectsComposer(container);
commentsComposerModule(container);
postMetricsComposeModule(container);

interface IApplicationControllers {
  userController: UserController;
  portfolioController: PortfolioController;
  projectController: WorkController;
  competitionController: CompetitionController;
  // chatController: ChatController;
  emailController: EmailController;
  ratingController: RatingController;
  favorateProjectsController: FavorateProjectsController;
  commentsController: CommentsController;
  // ... outros controladores
}

export class AppComposer {
  private controllers: IApplicationControllers;

  constructor() {
    this.controllers = this.composeControllers();
  }

  private composeControllers(): IApplicationControllers {
    // // Controladores (dependem dos Services/Use Cases de alto nível)
    const userController = container.get<UserController>(TYPES.UserController);
    const portfolioController = container.get<PortfolioController>(
      TYPES.PortfolioController
    );
    const projectController = container.get<WorkController>(
      TYPES.ProjectController
    );
    const competitionController = container.get<CompetitionController>(
      TYPES.CompetitionController
    );
    // const chatController = container.get<ChatController>(TYPES.ChatController);
    const emailController = container.get<EmailController>(
      TYPES.EmailController
    );
    const ratingController = container.get<RatingController>(
      TYPES.RatingController
    );
    const favorateProjectsController =
      container.get<FavorateProjectsController>(
        TYPES.FavorateProjectsController
      );

    const commentsController = container.get<CommentsController>(
      TYPES.CommentsController
    );

    return {
      userController,
      portfolioController,
      projectController,
      competitionController,
      // chatController,
      emailController,
      ratingController,
      favorateProjectsController,
      commentsController,
      // ... retorne outras instâncias de controlador
    };
  }

  // Método para registrar todas as rotas no Fastify
  public registerRoutes(app: FastifyInstance): void {
    UserRoute.register(app, this.controllers.userController);
    PortfolioRoute.register(app, this.controllers.portfolioController);
    ProjectRoute.register(app, this.controllers.projectController);
    CompetitionRoute.register(app, this.controllers.competitionController);
    // ChatRoute.register(app, this.controllers.chatController);
    EmailRoute.register(app, this.controllers.emailController);
    RatingRoute.register(app, this.controllers.ratingController);
    FavorateProjectsRoute.register(
      app,
      this.controllers.favorateProjectsController
    );
    CommentsRoute.register(app, this.controllers.commentsController);
  }

  public registerHandlers(): void {
    const portfolioHandler = container.get(PortfolioUserCreatedHandler);
    const emailUserCreatedHandler = container.get(EmailUserCreatedHandler);
    const emailUserUpdateHandler = container.get(EmailUserUpdateHandler);
  }

  // Se você tiver configurações globais do Fastify, pode tê-las aqui
  public configureFastify(app: FastifyInstance): void {
    app.setErrorHandler(configureErrorHandling);
  }
}
