import ratingRepository from "@repository/ratingRep/RatingRepositoryImp";
import Rating from "@domain/entities/rating/Rating";
import RatingUseCases from "@application/useCases/RatingUseCases";
import RatingRepository from "@domain/entities/rating/RatingRepository";
import { Conflict } from "@domain/error/HttpError";

class RatingServiceImp implements RatingUseCases {
  constructor(private readonly ratingRepository: RatingRepository) {}

  async register(rating: Rating): Promise<Rating> {
    const existeRating = await this.findByUserAndPortfolio(
      rating.userId,
      rating.portfolioId
    );

    if (existeRating)
      throw new Conflict("Não é permitido mais de uma avaliação");

    const ratingDomain = await this.ratingRepository.insert(rating);
    return ratingDomain;
  }

  async findMany(): Promise<Rating[]> {
    return await this.ratingRepository.findMany();
  }

  async findByUserId(userId: string): Promise<Rating[]> {
    return await this.ratingRepository.findByUserId(userId);
  }

  async findByPortfolioId(portfolioId: string): Promise<Rating[]> {
    return await this.ratingRepository.findByPortfolioId(portfolioId);
  }

  async findByUserAndPortfolio(
    userId: string,
    portfolioId: string
  ): Promise<Rating | null> {
    return await this.ratingRepository.findByUserAndPortfolio(
      userId,
      portfolioId
    );
  }

  async update(rating: Rating): Promise<Rating> {
    return await this.ratingRepository.update(rating);
  }

  async delete(id: string): Promise<Rating> {
    return await this.ratingRepository.delete(id);
  }
}

const ratingService: RatingUseCases = new RatingServiceImp(ratingRepository);
export default ratingService;
