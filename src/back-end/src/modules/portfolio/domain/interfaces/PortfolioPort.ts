export interface IPortfolioPort {
  exist(portfolioId: string): Promise<boolean>;
  findIdByAuthor(authorId: string): Promise<string | null>;
  getOrCreateIdByAuthor(authorId: string): Promise<string>;
  isOwnedBy(portfolioId: string, authorId: string): Promise<boolean>;
}
