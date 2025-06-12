import Portfolio from "./Portfolio";

export default interface PortfolioRepository {
  insert(portfolio: Portfolio): Promise<Portfolio>;
  findMany(): Promise<Portfolio[]>;
  findById(id: string): Promise<Portfolio | null>;
  findByAuthor(authorId: string): Promise<Portfolio[]>;
  update(portfolio: Portfolio): Promise<Portfolio>;
  deleteById(id: string): Promise<Portfolio | null>;
}
