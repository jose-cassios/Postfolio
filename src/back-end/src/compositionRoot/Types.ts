// src/compositionRoot/types.ts

export const TYPES = {
  // Repositórios
  IUserRepository: Symbol.for("IUserRepository"),
  IPortfolioRepository: Symbol.for("IPortfolioRepository"),
  IRatingRepository: Symbol.for("IRatingRepository"),
  ICompetitionRepository: Symbol.for("ICompetitionRepository"),
  IProjectRepository: Symbol.for("IProjectRepository"),
  IProjectCompDetailsRepository: Symbol.for("IProjectCompDetailsRepository"),
  // IMessageRepository: Symbol.for("IMessageRepository"),
  IFavorateProjectsRepository: Symbol.for("IFavorateProjectsRepository"),
  ICommentsRepository: Symbol.for("ICommentsRepository"),
  IPostMetricsRepository: Symbol.for("IPostMetricsRepository"),

  // Portas de Aplicação (Use Cases de alto nível)
  IUserService: Symbol.for("IUserService"),
  IPortfolioService: Symbol.for("IPortfolioService"),
  IRatingService: Symbol.for("IRatingService"),
  ICompetitionService: Symbol.for("ICompetitionService"),
  IProjectService: Symbol.for("IProjectService"),
  IProjectCompDetailsService: Symbol.for("IProjectCompDetailsService"),
  // IMessageService: Symbol.for("IMessageService"),
  // IUsersConnects: Symbol.for("IUsersConnects"),
  IEmailService: Symbol.for("IEmailService"),
  IFavorateProjectsService: Symbol.for("IFavorateProjectsService"),
  ICommentsService: Symbol.for("ICommentsService"),

  // Portas de Saída (Adapters entre Domínios)
  PortfolioPort: Symbol.for("PortfolioPort"),
  UserPort: Symbol.for("UserPort"),
  ProjectPort: Symbol.for("ProjectPort"),
  CompetitionPort: Symbol.for("CompetitionPort"),
  ProjectCompDetailsPort: Symbol.for("IProjectCompDetailsPort"),
  RatingPort: Symbol.for("RatingPort"),
  FavorateProjectsPort: Symbol.for("FavorateProjectsPort"),

  // Services (implementações concretas dos Use Cases de alto nível)
  UserService: Symbol.for("UserService"),
  PortfolioService: Symbol.for("PortfolioService"),
  RatingService: Symbol.for("RatingService"),
  CompetitionService: Symbol.for("CompetitionService"),
  ProjectService: Symbol.for("ProjectService"),
  ProjectCompDetailsService: Symbol.for("WorkCompDetailsService"),
  EmailService: Symbol.for("EmailService"),

  // Controladores
  UserController: Symbol.for("UserController"),
  PortfolioController: Symbol.for("PortfolioController"),
  RatingController: Symbol.for("RatingController"),
  CompetitionController: Symbol.for("CompetitionController"),
  ProjectController: Symbol.for("WorkController"),
  ProjectCompDetailsController: Symbol.for("WorkCompDetailsController"),
  // ChatController: Symbol.for("ChatController"),
  EmailController: Symbol.for("EmailController"),
  FavorateProjectsController: Symbol.for("FavorateProjectsController"),
  CommentsController: Symbol.for("CommentsController"),

  // Handlers
  // PortfolioUserCreatedHandler: Symbol.for("PortfolioUserCreatedHandler"),

  // Utilitários (se precisar injetar, embora muitos sejam estáticos)
  // PrismaClient: Symbol.for("PrismaClient"), // Se você quiser injetar a instância do Prisma
};
