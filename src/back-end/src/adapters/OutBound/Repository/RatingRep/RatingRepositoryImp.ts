import Rating from "../../../../Domain/Entities/Rating/Rating";
import RatingRepository from "../../../../Domain/Entities/Rating/RatingRepository";
import Mapper from "../../../../Util/Mapper";
import { PrismaRatingRepository } from "./PrismaRatingRepository";

class RatingRepositoryImp implements RatingRepository {
  async insert(rating: Rating): Promise<Rating> {
    const ratingEntity = Mapper.Rating.toPrisma(rating);
    await PrismaRatingRepository.insert(ratingEntity);
    return rating;
  }

  async findMany(): Promise<Rating[]> {
    return (await PrismaRatingRepository.findMany()).map(
      Mapper.Rating.toDomain
    );
  }

  async findByUserId(userId: string): Promise<Rating[]> {
    return (await PrismaRatingRepository.findByUserId(userId)).map(
      Mapper.Rating.toDomain
    );
  }

  async findByPortfolioId(portfolioId: string): Promise<Rating[]> {
    return (await PrismaRatingRepository.findByPortfolioId(portfolioId)).map(
      Mapper.Rating.toDomain
    );
  }

  async findByUserAndPortfolio(
    userId: string,
    portfolioId: string
  ): Promise<Rating | null> {
    const rating = await PrismaRatingRepository.findByUserAndPortfolio(
      userId,
      portfolioId
    );
    if (!rating) return null;

    return Mapper.Rating.toDomain(rating);
  }

  async update(rating: Rating): Promise<Rating> {
    const ratingEntity = Mapper.Rating.toPrisma(rating);
    return Mapper.Rating.toDomain(
      await PrismaRatingRepository.update(ratingEntity)
    );
  }

  async delete(id: string): Promise<Rating> {
    return Mapper.Rating.toDomain(await PrismaRatingRepository.delete(id));
  }
}

const ratingRepository: RatingRepository = new RatingRepositoryImp();
export default ratingRepository;
