import { CreatePortfolioDTO } from "@portfolio/api/PortfolioDTO";
import { Portfolio } from "@portfolio/domain/entities/Portfolio";
import { Portfolio as PortfolioModel } from "@PrismaGen/client";

export const PortfolioMapper = {
  fromPrismaToDomain(model: PortfolioModel): Portfolio {
    return new Portfolio(
      model.id,
      model.name,
      model.description,
      model.pagelink,
      model.authorId
    );
  },
  fromDomaintoPrisma(portfolio: Portfolio): PortfolioModel {
    return {
      id: portfolio.getId(),
      name: portfolio.getName(),
      description: portfolio.getDescription(),
      pagelink: portfolio.getPageLink(),
      authorId: portfolio.getAuthorId(),
    };
  },
  fromCreatePortfolioDTOtoDomain(dto: CreatePortfolioDTO): Portfolio {
    return new Portfolio(
      "",
      dto.name,
      dto.description,
      dto.pagelink,
      dto.authorId
    );
  },
};
