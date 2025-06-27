import prismaPortfolioRepository, {
  PrismaPortfolioRepository,
} from "@repository/portfolioRep/PrismaPortfolioRepository";
import PortfolioRepository from "@domain/entities/portfolio/PortfolioRepository";
import Portfolio from "@domain/entities/portfolio/Portfolio";
import Mapper from "@util/Mapper";

class PortfolioRepositoryImp implements PortfolioRepository {
  constructor(
    private readonly prismaPortfolioRepository: PrismaPortfolioRepository
  ) {}

  async insert(portfolio: Portfolio): Promise<Portfolio> {
    const portfolioEntity = Mapper.Portfolio.toPrisma(portfolio);
    portfolio.id = (
      await this.prismaPortfolioRepository.insert(portfolioEntity)
    ).id;
    return portfolio;
  }

  async findMany(): Promise<Portfolio[]> {
    return (await this.prismaPortfolioRepository.findMany()).map(
      Mapper.Portfolio.toDomain
    );
  }

  async findById(id: string): Promise<Portfolio | null> {
    const portfolioEntity = await this.prismaPortfolioRepository.findById(id);

    if (!portfolioEntity) return null;

    return Mapper.Portfolio.toDomain(portfolioEntity);
  }
  async findByAuthor(authorId: string): Promise<Portfolio[]> {
    const portfolioEntities = await this.prismaPortfolioRepository.findByAuthor(
      authorId
    );
    const portfolios = portfolioEntities.map(Mapper.Portfolio.toDomain);
    return portfolios;
  }

  async update(portfolio: Portfolio): Promise<Portfolio> {
    const portfolioEntity = Mapper.Portfolio.toPrisma(portfolio);
    await this.prismaPortfolioRepository.update(portfolioEntity);
    return portfolio;
  }

  async deleteById(id: string): Promise<Portfolio | null> {
    return await this.prismaPortfolioRepository.deleteById(id);
  }
}

const portfolioRepository: PortfolioRepository = new PortfolioRepositoryImp(
  prismaPortfolioRepository
);
export default portfolioRepository;
