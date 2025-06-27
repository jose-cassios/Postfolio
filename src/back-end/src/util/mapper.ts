import PrismaUser from "@models/PrismaUser";
import User from "@domain/entities/user/User";
import PrismaPortfolio from "@models/PrismaPortfolio";
import Portfolio from "@domain/entities/portfolio/Portfolio";
import PrismaRating from "@models/PrismaRating";
import Rating from "@domain/entities/rating/Rating";
import Email from "@domain/valueObject/Email";

const UserMapper = {
  toDomain(prismaUser: PrismaUser): User {
    return new User(
      prismaUser.id,
      prismaUser.name,
      new Email(prismaUser.email, false),
      prismaUser.passWord,
      prismaUser.status
    );
  },
  toPrisma(user: User): PrismaUser {
    return {
      id: user.id,
      name: user.name,
      email: user.email.getValue(),
      passWord: user.passWord,
      status: user.status,
    };
  },
};

const PortfolioMapper = {
  toDomain(prismaPortfolio: PrismaPortfolio): Portfolio {
    return new Portfolio(
      prismaPortfolio.id,
      prismaPortfolio.name,
      prismaPortfolio.description,
      prismaPortfolio.pageLink,
      prismaPortfolio.authorId
    );
  },
  toPrisma(portfolio: Portfolio): PrismaPortfolio {
    return {
      id: portfolio.id,
      name: portfolio.name,
      description: portfolio.description,
      pageLink: portfolio.pageLink,
      authorId: portfolio.authorId,
    };
  },
};

const RatingMapper = {
  toDomain(prismaRating: PrismaRating): Rating {
    return new Rating(
      prismaRating.id,
      prismaRating.userId,
      prismaRating.portfolioId,
      prismaRating.score
    );
  },
  toPrisma(rating: Rating): PrismaRating {
    return {
      id: rating.id,
      userId: rating.userId,
      portfolioId: rating.portfolioId,
      score: rating.score,
    };
  },
};

const Mapper = {
  User: UserMapper,
  Portfolio: PortfolioMapper,
  Rating: RatingMapper,
};

export default Mapper;
