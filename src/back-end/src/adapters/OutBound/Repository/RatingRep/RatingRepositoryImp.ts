import Rating from "@domain/entities/rating/Rating";
import RatingRepository from "@domain/entities/rating/RatingRepository";
import Mapper from "@util/Mapper";
import { PrismaRatingRepository } from "@repository/ratingRep/PrismaRatingRepository";
import prismaRatingRepository from "./PrismaRatingRepository";

class RatingRepositoryImp implements RatingRepository {
  constructor(
    private readonly prismaRatingRepository: PrismaRatingRepository
  ) {}

  async insert(rating: Rating): Promise<Rating> {
    const ratingEntity = Mapper.Rating.toPrisma(rating);
    await this.prismaRatingRepository.insert(ratingEntity);
    return rating;
  }

  async findMany(): Promise<Rating[]> {
    return (await this.prismaRatingRepository.findMany()).map(
      Mapper.Rating.toDomain
    );
  }

  async findByUserId(userId: string): Promise<Rating[]> {
    return (await this.prismaRatingRepository.findByUserId(userId)).map(
      Mapper.Rating.toDomain
    );
  }

  async findByPortfolioId(portfolioId: string): Promise<Rating[]> {
    return (
      await this.prismaRatingRepository.findByPortfolioId(portfolioId)
    ).map(Mapper.Rating.toDomain);
  }

  async findByUserAndPortfolio(
    userId: string,
    portfolioId: string
  ): Promise<Rating | null> {
    const rating = await this.prismaRatingRepository.findByUserAndPortfolio(
      userId,
      portfolioId
    );
    if (!rating) return null;

    return Mapper.Rating.toDomain(rating);
  }

  async update(rating: Rating): Promise<Rating> {
    const ratingEntity = Mapper.Rating.toPrisma(rating);
    return Mapper.Rating.toDomain(
      await this.prismaRatingRepository.update(ratingEntity)
    );
  }

  async delete(id: string): Promise<Rating> {
    return Mapper.Rating.toDomain(await this.prismaRatingRepository.delete(id));
  }
}

const ratingRepository: RatingRepository = new RatingRepositoryImp(
  prismaRatingRepository
);
export default ratingRepository;
