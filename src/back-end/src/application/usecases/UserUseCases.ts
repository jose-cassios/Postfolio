// import Portfolio from "@domain/entities/portfolio/Portfolio";
// import Rating from "@domain/entities/rating/Rating";
import User from "@domain/entities/user/User";
import Email from "@domain/valueObject/Email";

export default interface UserUseCases {
  register(user: User): Promise<void>;
  login(email: Email, passWord: string): Promise<string>;

  findMany(): Promise<User[]>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;

  // findPortfolios(authorId: string): Promise<Portfolio[]>;
  // findRatings(authorId: string): Promise<Rating[]>;
  // createReting(rating: Rating): Promise<Rating>;
  // findManyRating(id: string): Promise<Rating[]>;

  deleteById(id: string): Promise<User | null>;
}
