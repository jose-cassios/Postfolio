import { TYPES } from "@compositionRoot/Types";
import { Container } from "inversify";

import { IPortfolioRepository } from "@portfolio/domain/interfaces/IPortfolioRepository";
import { IPortfolioService } from "@portfolio/domain/interfaces/IPortfolioService";
import { IPortfolioPort } from "@portfolio/domain/interfaces/PortfolioPort";

import { PrismaPortfolioRepository } from "@portfolio/infra/database/PortfolioRepository";
import { PortfolioService } from "@portfolio/application/PortfolioService";
import { PortfolioAdapter } from "@portfolio/infra/PortfolioAdapter";
import { PortfolioController } from "@portfolio/api/PortfolioController";
import { PortfolioUserCreatedHandler } from "@portfolio/handler/PortfolioUserCreatedHandler";

export function portfolioComposeModule(container: Container): void {
  container
    .bind<IPortfolioRepository>(TYPES.IPortfolioRepository)
    .to(PrismaPortfolioRepository)
    .inRequestScope();
  container
    .bind<IPortfolioService>(TYPES.IPortfolioService)
    .to(PortfolioService)
    .inRequestScope();
  container
    .bind<IPortfolioPort>(TYPES.PortfolioPort)
    .to(PortfolioAdapter)
    .inRequestScope();
  container
    .bind<PortfolioController>(TYPES.PortfolioController)
    .to(PortfolioController)
    .inRequestScope();

  // Handlers
  container
    .bind<PortfolioUserCreatedHandler>(PortfolioUserCreatedHandler)
    .toSelf()
    .inRequestScope();
}
