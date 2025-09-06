import { prisma } from "@infrastructure/config/Prisma";
import { InternalServerError } from "@shared/error/HttpError";
import { Portfolio } from "@portfolio/domain/entities/Portfolio";
import { IPortfolioRepository } from "@portfolio/domain/interfaces/IPortfolioRepository";
import { PortfolioMapper } from "@portfolio/application/PortfolioMapper";

export class PrismaPortfolioRepository implements IPortfolioRepository {
  async create(portfolio: Portfolio): Promise<Portfolio> {
    try {
      const model = await prisma.portfolio.create({
        data: {
          ...PortfolioMapper.fromDomaintoPrisma(portfolio),
          id: undefined,
        },
      });

      return PortfolioMapper.fromPrismaToDomain(model);
    } catch (error) {
      throw new InternalServerError("Erro ao salvar Portfolio!");
    }
  }

  async update(portfolio: Portfolio): Promise<Portfolio> {
    try {
      const model = await prisma.portfolio.update({
        where: {
          id: portfolio.getId(),
        },
        data: {
          ...PortfolioMapper.fromDomaintoPrisma(portfolio),
        },
      });

      return PortfolioMapper.fromPrismaToDomain(model);
    } catch (error) {
      throw new InternalServerError("Não foi possivel atualizar o portfolio!");
    }
  }

  async deleteById(id: string): Promise<Portfolio | null> {
    try {
      const portfolioModel = await prisma.portfolio.delete({
        where: {
          id,
        },
      });

      return portfolioModel
        ? PortfolioMapper.fromPrismaToDomain(portfolioModel)
        : null;
    } catch (error) {
      throw new InternalServerError("Não foi possivel deletar o portfolio!");
    }
  }

  async findMany(): Promise<Portfolio[]> {
    const portfolioModel = await prisma.portfolio.findMany();
    return portfolioModel.map(PortfolioMapper.fromPrismaToDomain);
  }

  async findById(id: string): Promise<Portfolio | null> {
    const portfolioModel = await prisma.portfolio.findUnique({
      where: {
        id,
      },
    });
    return portfolioModel
      ? PortfolioMapper.fromPrismaToDomain(portfolioModel)
      : null;
  }

  async findByAuthor(authorId: string): Promise<Portfolio | null> {
    const portfolioModel = await prisma.portfolio.findUnique({
      where: { authorId },
    });

    return portfolioModel
      ? PortfolioMapper.fromPrismaToDomain(portfolioModel)
      : null;
  }
}
