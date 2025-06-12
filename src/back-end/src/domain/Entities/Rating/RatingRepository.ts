import Rating from "./Rating";

export default interface RatingRepository {
  insert(rating: Rating): Promise<Rating>;
  findMany(): Promise<Rating[]>;
  findByPortfolioId(portfolioId: string): Promise<Rating[]>;
  findByUserId(userId: string): Promise<Rating[]>;
  findByUserAndPortfolio(
    userId: string,
    portfolioId: string
  ): Promise<Rating | null>;
  update(rating: Rating): Promise<Rating>;
  delete(id: string): Promise<Rating>;
}
