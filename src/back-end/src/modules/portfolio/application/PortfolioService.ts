import { IPortfolioRepository } from "@portfolio/domain/interfaces/IPortfolioRepository";
import {
  CreatePortfolioDTO,
  UpdatePortfolioDTO,
} from "@portfolio/api/PortfolioDTO";
import { PortfolioMapper } from "@portfolio/application/PortfolioMapper";
import { BadRequest, NotFound } from "@shared/error/HttpError";
import { Portfolio } from "@portfolio/domain/entities/Portfolio";
import { UserPort } from "@user/domain/interfaces/UserPort";
import { IPortfolioService } from "@portfolio/domain/interfaces/IPortfolioService";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";
import { ProjectPort } from "@project/domain/interfaces/ProjectPort";
import { ProjectContract } from "@shared/contracts/ProjectContracts";

@injectable()
export class PortfolioService implements IPortfolioService {
  constructor(
    @inject(TYPES.IPortfolioRepository)
    private repository: IPortfolioRepository,
    @inject(TYPES.UserPort)
    private userPort: UserPort,
    @inject(TYPES.ProjectPort)
    private workPort: ProjectPort
  ) {}

  async create(createPortfolioDto: CreatePortfolioDTO): Promise<Portfolio> {
    const exist = await this.userPort.exist(createPortfolioDto.authorId);

    if (!exist) throw new BadRequest("Author não registrado!");

    const portfoioDomain =
      PortfolioMapper.fromCreatePortfolioDTOtoDomain(createPortfolioDto);

    return await this.repository.create(portfoioDomain);
  }

  async update(updatePortfolioDto: UpdatePortfolioDTO): Promise<Portfolio> {
    const portfolio = await this.repository.findById(updatePortfolioDto.id);

    if (!portfolio) throw new NotFound("Portfolio não encontrado!");

    portfolio.update(updatePortfolioDto);

    return await this.repository.update(portfolio);
  }

  async deleteById(id: string): Promise<Portfolio | null> {
    const portfolio = await this.repository.deleteById(id);
    return portfolio;
  }

  async findMany(): Promise<Portfolio[]> {
    const portfolios = await this.repository.findMany();
    return portfolios;
  }

  async findById(id: string): Promise<Portfolio | null> {
    return await this.repository.findById(id);
  }

  async findProjects(id: string): Promise<ProjectContract[]> {
    return await this.workPort.findProjectsByPortfolioId(id);
  }

  async findByAuthor(authorId: string): Promise<Portfolio | null> {
    return await this.repository.findByAuthor(authorId);
  }

  async findByUsername(username: string): Promise<Portfolio | null> {
    return await this.repository.findByUsername(username);
  }
}
