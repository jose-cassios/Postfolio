import { TYPES } from "@compositionRoot/Types";
import { IPortfolioPort } from "@portfolio/domain/interfaces/PortfolioPort";
import { IPortfolioRepository } from "@portfolio/domain/interfaces/IPortfolioRepository";
import { inject, injectable } from "inversify";
import { Portfolio } from "@portfolio/domain/entities/Portfolio";

@injectable()
export class PortfolioAdapter implements IPortfolioPort {
  constructor(
    @inject(TYPES.IPortfolioRepository)
    private portfolioRepository: IPortfolioRepository
  ) {}
  async exist(portfolioId: string): Promise<boolean> {
    const exist = await this.portfolioRepository.findById(portfolioId);

    return exist ? true : false;
  }

  async findIdByAuthor(authorId: string): Promise<string | null> {
    const portfolio = await this.portfolioRepository.findByAuthor(authorId);
    return portfolio?.getId() ?? null;
  }

  async getOrCreateIdByAuthor(authorId: string): Promise<string> {
    const existing = await this.portfolioRepository.findByAuthor(authorId);
    if (existing) return existing.getId();

    const portfolio = await this.portfolioRepository.create(
      new Portfolio("", "Portfolio", "", null, authorId)
    );
    return portfolio.getId();
  }

  async isOwnedBy(portfolioId: string, authorId: string): Promise<boolean> {
    const portfolio = await this.portfolioRepository.findById(portfolioId);
    return portfolio?.getAuthorId() === authorId;
  }
}
