import PortfolioUseCases from "@application/useCases/PortfolioUseCases";
import userServiceImp from "@application/service/UserServiceImp";
import portfolioRepository from "@repository/portfolioRep/PortfolioRepositoryImp";
import Portfolio from "@domain/entities/portfolio/Portfolio";
import { BadRequest } from "@domain/error/HttpError";
import PortfolioRepository from "@domain/entities/portfolio/PortfolioRepository";
import UserUseCases from "@useCases/UserUseCases";

class PortfolioServiceImp implements PortfolioUseCases {
  constructor(
    private readonly portfolioRepository: PortfolioRepository,
    private readonly userService: UserUseCases
  ) {}

  async register(portfolio: Portfolio): Promise<Portfolio> {
    const author = await this.userService.findById(portfolio.authorId);

    console.log("\nAuthor: ", author);

    if (!author) throw new BadRequest("Author não registrado!");
    return await this.portfolioRepository.insert(portfolio);
  }

  async findMany(): Promise<Portfolio[]> {
    const portfolios = await this.portfolioRepository.findMany();
    return portfolios;
  }

  async findById(id: string): Promise<Portfolio | null> {
    return await this.portfolioRepository.findById(id);
  }

  async findByAuthorId(authorId: string): Promise<Portfolio[]> {
    return await this.portfolioRepository.findByAuthor(authorId);
  }

  async update(portfolio: Portfolio): Promise<Portfolio> {
    return await this.portfolioRepository.update(portfolio);
  }

  async deleteById(id: string): Promise<Portfolio | null> {
    const portfolio = await this.portfolioRepository.deleteById(id);
    return portfolio;
  }
}

const portfolioService: PortfolioUseCases = new PortfolioServiceImp(
  portfolioRepository,
  userServiceImp
);
export default portfolioService;
