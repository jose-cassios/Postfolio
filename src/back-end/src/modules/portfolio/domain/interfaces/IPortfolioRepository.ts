import { Portfolio } from "@portfolio/domain/entities/Portfolio";

export interface IPortfolioRepository {
  create(portfolio: Portfolio): Promise<Portfolio>;
  update(portfolio: Portfolio): Promise<Portfolio>;
  deleteById(id: string): Promise<Portfolio | null>;

  findMany(): Promise<Portfolio[]>;
  findById(id: string): Promise<Portfolio | null>;
  findByAuthor(authorId: string): Promise<Portfolio | null>;
  findByUsername(username: string): Promise<Portfolio | null>;
}
