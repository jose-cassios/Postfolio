import { TYPES } from "@compositionRoot/Types";
import { IPortfolioService } from "@portfolio/domain/interfaces/IPortfolioService";

import { EventHandler, EventListener } from "@shared/event/EventListener";
import { UserCreatedEvent } from "@shared/event/UserCreatedEvent";
import { inject, injectable } from "inversify";

@injectable()
export class PortfolioUserCreatedHandler
  implements EventHandler<UserCreatedEvent>
{
  constructor(
    @inject(TYPES.IPortfolioService)
    private portfolioService: IPortfolioService
  ) {
    EventListener.subscribeHandler(this);
    console.log("[PortfolioUserCreatedHandler] foi criado.\n");
  }

  async handle(event: UserCreatedEvent): Promise<void> {
    await this.portfolioService.create({
      name: "default",
      description: "not found",
      pagelink: null,
      authorId: event.userId,
    });
  }

  public getEventId(): string {
    return UserCreatedEvent.ID;
  }

  // async emit(data: UserCreatedEventData): Promise<string> {
  //   this.portfolioService.create({
  //     name: "default",
  //     description: "not found",
  //     pagelink: null,
  //     authorId: data.userId,
  //   });

  //   return "emitido";
  // }
}
