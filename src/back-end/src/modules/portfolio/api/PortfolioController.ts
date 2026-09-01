import { FastifyReply, FastifyRequest } from "fastify";
import { BadRequest, Forbidden, NotFound } from "@shared/error/HttpError";
import { IPortfolioService } from "@portfolio/domain/interfaces/IPortfolioService";
import {
  CreatePortfolioRequest,
  UpdatePortfolioRequest,
} from "@portfolio/api/PortfolioSchema";
import {
  CreatePortfolioDTO,
  UpdatePortfolioDTO,
} from "@portfolio/api/PortfolioDTO";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";

@injectable()
export class PortfolioController {
  constructor(
    @inject(TYPES.IPortfolioService)
    private portfolioService: IPortfolioService
  ) {}

  async register(req: CreatePortfolioRequest, reply: FastifyReply) {
    const authorId = req.user?.id;
    if (!authorId) throw new BadRequest("Autor e obrigatorio");

    const createPortfolioDto: CreatePortfolioDTO = { ...req.body, authorId };
    const portfolio = await this.portfolioService.create(createPortfolioDto);
    reply.send(portfolio);
  }

  async findAll(req: FastifyRequest, reply: FastifyReply) {
    const portfolios = await this.portfolioService.findMany();
    reply.send(portfolios);
  }

  async findByUser(req: FastifyRequest, reply: FastifyReply) {
    const authorId = req.user?.id;
    if (!authorId) throw new BadRequest("Id e obrigatorio");

    const portfolio = await this.portfolioService.findByAuthor(authorId);
    if (!portfolio) throw new NotFound("Portfolio nao encontrado");
    reply.send(portfolio);
  }

  async findByUsername(req: FastifyRequest, reply: FastifyReply) {
    const { username } = req.params as { username?: string };
    if (!username) throw new BadRequest("Nome de usuario e obrigatorio");

    const portfolio = await this.portfolioService.findByUsername(username);
    if (!portfolio) return reply.send(null);
    reply.send(portfolio);
  }

  async findById(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.body as Partial<{ id: string }>;
    if (!id) throw new BadRequest("Id e obrigatorio");

    const portfolio = await this.portfolioService.findById(id);
    if (!portfolio) throw new NotFound("Portfolio nao encontrado");
    reply.send(portfolio);
  }

  async getProjects(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as Partial<{ id: string }>;
    if (!id) throw new BadRequest("Id e obrigatorio");

    const response = await this.portfolioService.findProjects(id);
    reply.send(response);
  }

  async getProjectsByUsername(req: FastifyRequest, reply: FastifyReply) {
    const { username } = req.params as { username?: string };
    if (!username) throw new BadRequest("Nome de usuario e obrigatorio");

    const portfolio = await this.portfolioService.findByUsername(username);
    if (!portfolio) return reply.send([]);

    const response = await this.portfolioService.findProjects(
      portfolio.getId()
    );
    reply.send(response);
  }

  async update(req: UpdatePortfolioRequest, reply: FastifyReply) {
    const authorId = req.user?.id;
    if (!authorId) throw new BadRequest("Autor e obrigatorio");

    const portfolio = await this.portfolioService.findById(req.params.id);
    if (!portfolio) throw new NotFound("Portfolio nao encontrado");
    if (portfolio.getAuthorId() !== authorId) {
      throw new Forbidden("Voce so pode editar o proprio portfolio.");
    }

    const updatePortfolioDto: UpdatePortfolioDTO = {
      id: req.params.id,
      ...req.body,
    };
    const response = await this.portfolioService.update(updatePortfolioDto);
    reply.send(response);
  }

  async deleteById(req: FastifyRequest, reply: FastifyReply) {
    const authorId = req.user?.id;
    const params = req.params as Partial<{ id: string }>;
    const body = req.body as Partial<{ id: string }> | undefined;
    const id = params.id ?? body?.id;
    if (!id) throw new BadRequest("Id e obrigatorio");

    const portfolio = await this.portfolioService.findById(id);
    if (!portfolio) throw new NotFound("Portfolio nao encontrado");
    if (!authorId || portfolio.getAuthorId() !== authorId) {
      throw new Forbidden("Voce so pode remover o proprio portfolio.");
    }

    reply.send(await this.portfolioService.deleteById(id));
  }
}
