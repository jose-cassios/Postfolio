import Portfolio from "../../Domain/Entities/Portfolio/Portfolio";

export default interface PortfolioUseCases {
  register(portfolio: Portfolio): Promise<Portfolio>;
  findMany(): Promise<Portfolio[]>;
  findById(id: string): Promise<Portfolio | null>;
  findByAuthorId(authorId: string): Promise<Portfolio[]>;
  update(portfolio: Portfolio): Promise<Portfolio>;
  deleteById(id: string): Promise<Portfolio | null>;
}
