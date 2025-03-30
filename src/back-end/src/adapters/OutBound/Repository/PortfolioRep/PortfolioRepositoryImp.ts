import { PrismaPortfolioRepository } from "./PrismaPortfolioRepository";
import PortfolioRepository from "../../../../Domain/Entities/Portfolio/PortfolioRepository";
import Portfolio from "../../../../Domain/Entities/Portfolio/Portfolio";
// import { PortfolioMapper } from "../../util/Mapper";
import Mapper from "../../../../Util/Mapper";

class PortfolioRepositoryImp implements PortfolioRepository {
  async insert(portfolio: Portfolio): Promise<Portfolio> {
    const portfolioEntity = Mapper.Portfolio.toPrisma(portfolio);
    portfolio.id = (await PrismaPortfolioRepository.insert(portfolioEntity)).id;
    return portfolio;
  }

  async findMany(): Promise<Portfolio[]> {
    return (await PrismaPortfolioRepository.findMany()).map(
      Mapper.Portfolio.toDomain
    );
  }
  async findById(id: number): Promise<Portfolio | null> {
    const portfolioEntity = await PrismaPortfolioRepository.findById(id);

    if (!portfolioEntity) return null;

    return Mapper.Portfolio.toDomain(portfolioEntity);
  }
  async findByAuthor(authorId: string): Promise<Portfolio[]> {
    const portfolioEntities = await PrismaPortfolioRepository.findByAuthor(
      authorId
    );
    // console.log("Aqui:\n", portfolioEntities);
    const portfolios = portfolioEntities.map(Mapper.Portfolio.toDomain);
    // console.log("Aqui2  :\n", portfolioEntities);
    return portfolios;
  }
  async deleteById(id: number): Promise<Portfolio | null> {
    console.log("Aqui 1\n");
    return await PrismaPortfolioRepository.deleteById(id);
  }
}

const portfolioRepository: PortfolioRepository = new PortfolioRepositoryImp();
export default portfolioRepository;
