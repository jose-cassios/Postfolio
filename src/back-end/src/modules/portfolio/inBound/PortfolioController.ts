import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequest } from "@shared/error/HttpError";
import { IPortfolioService } from "@portfolio/service/IPortfolioService";
import {
  RegisterPortfolioRequest,
  UpdatePortfolioRequest,
} from "@portfolio/inBound/PortfolioSchema";
import {
  CreatePortfolioDTO,
  UpdatePortfolioDTO,
} from "@portfolio/dtos/PortfolioDTO";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";

@injectable()
export class PortfolioController {
  constructor(
    @inject(TYPES.IPortfolioService)
    private portfolioService: IPortfolioService
  ) {}

  async register(req: RegisterPortfolioRequest, reply: FastifyReply) {
    const authorId = req.user?.id;

    if (!authorId) throw new BadRequest("Autor é obrigatorio");

    const createPortfolioDto: CreatePortfolioDTO = { ...req.body, authorId };

    const portfolio = await this.portfolioService.register(createPortfolioDto);

    reply.send(portfolio);
  }

  async findAll(req: FastifyRequest, reply: FastifyReply) {
    const portfolios = await this.portfolioService.findMany();
    reply.send(portfolios);
    // const portfolios = portfolioService.
  }

  async findByUser(req: FastifyRequest, reply: FastifyReply) {
    const authorId = req.user?.id || null;

    if (!authorId) throw new BadRequest("Id é obrigatorio");

    const portfolio = await this.portfolioService.findByAuthor(authorId);
    reply.send(portfolio);
  }

  async findById(req: FastifyRequest, reply: FastifyReply) {
    const { id = null } = req.body as Partial<{ id: string }>;

    if (!id) throw new BadRequest("Id é obrigatorio");

    const portfolio = await this.portfolioService.findById(id);

    reply.send(portfolio);
  }

  async getWorks(req: FastifyRequest, reply: FastifyReply) {
    const { id = null } = req.params as Partial<{ id: string }>;
    if (!id) throw new BadRequest("Id é obrigatorio");

    const response = await this.portfolioService.findWorks(id);

    reply.send(response?.works);
  }

  async update(req: UpdatePortfolioRequest, reply: FastifyReply) {
    const authorId = req.user?.id;

    if (!authorId) throw new BadRequest("Autor é obrigatorio");

    const updatePortfolioDto: UpdatePortfolioDTO = {
      id: req.params.id,
      ...req.body,
      authorId,
    };

    const response = await this.portfolioService.update(updatePortfolioDto);

    reply.send(response);
  }

  async deleteById(req: FastifyRequest, reply: FastifyReply) {
    const { id = null } = req.body as Partial<{ id: string }>;

    if (!id) throw new BadRequest("Id é obrigatorio");

    const portfolio = await this.portfolioService.deleteById(id);
    reply.send(portfolio);
  }
}
