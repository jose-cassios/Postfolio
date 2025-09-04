import { Competition } from "@competition/domain/entities/Competition";
import { ICompetitionService } from "@competition/domain/interfaces/ICompetitionService";
import { TYPES } from "@compositionRoot/Types";
import {
  BadRequest,
  Conflict,
  InternalServerError,
  Unauthorized,
} from "@shared/error/HttpError";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "inversify";
import {
  CreateCompetitionRequest,
  UpdateCompetitionRequest,
} from "@competition/api/CompetitionSchema";
import { CreateCompetitionDTO } from "@competition/api/CompetitionDTO";

@injectable()
export class CompetitionController {
  constructor(
    @inject(TYPES.ICompetitionService)
    private competitionService: ICompetitionService
  ) {}

  async create(req: CreateCompetitionRequest, reply: FastifyReply) {
    const dto: CreateCompetitionDTO = { ...req.body };

    const response = await this.competitionService.create(dto);

    reply.send({
      msg: "Competição criada com sucesso",
      response,
    });
  }

  async update(req: UpdateCompetitionRequest, reply: FastifyReply) {
    // const dto: = {}

    // criar um dto para isso
    throw new InternalServerError("Not Implemented");
  }

  async delete(req: FastifyRequest, reply: FastifyReply) {
    const { competition } = req.params as { competition: string };

    if (!competition) throw new BadRequest("ID da competição é obrigatorio");

    const response = await this.competitionService.delete(competition);

    reply.send(response);
  }

  async subscribeWork(req: FastifyRequest, reply: FastifyReply) {
    const { competitionId, workId } = req.params as {
      competitionId: string;
      workId: string;
    };

    if (!competitionId) throw new BadRequest("ID da competição é obrigatorio");
    if (!workId) throw new BadRequest("ID da competição é obrigatorio");

    const response = await this.competitionService.subscribeProject(
      competitionId,
      workId
    );

    reply.send({ msg: "Projeto inscrito com sucesso." });
  }

  async unsubscribeWork(req: FastifyRequest, reply: FastifyReply) {
    const { competitionId, workId } = req.params as {
      competitionId: string;
      workId: string;
    };

    if (!competitionId) throw new BadRequest("ID da competição é obrigatorio");
    if (!workId) throw new BadRequest("ID da competição é obrigatorio");

    await this.competitionService.unsubscribeProject(competitionId, workId);

    reply.send({ msg: "Trabalho removido da competição" });
  }

  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const responses = await this.competitionService.findMany();

    reply.send(responses);
  }

  async getCompetition(req: FastifyRequest, reply: FastifyReply) {
    const { competitionId } = req.params as { competitionId: string };

    if (!competitionId) throw new BadRequest("ID da competição é obrigatorio");

    const response = await this.competitionService.findById(competitionId);
    console.log("{competition}(POST /:competitionID)[getCompetition]");
    reply.send(response);
  }

  async getProjectDetailsForCompetition(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const { competitionId } = req.params as {
      competitionId: string;
      workId: string;
    };

    const response = await this.competitionService.findSubscribedProjects(
      competitionId
    );

    reply.send(response);
  }

  async getProjectDetails(req: FastifyRequest, reply: FastifyReply) {
    const { competitionId, workId } = req.params as {
      competitionId: string;
      workId: string;
    };

    const response = await this.competitionService.findProjecWithDetails(
      competitionId,
      workId
    );

    reply.send(response);
  }

  // async createRating(req: FastifyRequest, reply: FastifyReply) {
  //   const user = req.user;

  //   if (!user) throw new Unauthorized("Usuario precisa fazer login");

  //   const { competitionId, workId } = req.params as {
  //     competitionId: string;
  //     workId: string;
  //   };

  //   const { score } = req.body as Partial<{ score: number }>;

  //   if (!competitionId) throw new BadRequest("A competição é necessaria");
  //   if (!workId) throw new BadRequest("O trabalho é necessario");
  //   if (score === undefined || score === null || isNaN(Number(score)))
  //     throw new BadRequest("A avaliação é necessaria");

  //   const dto: CreaetRatingDTO = {
  //     userId: user.id,
  //     workId,
  //     competitionId,
  //     score: Number(score),
  //   };

  //   const response = await this.competitionService.createRating(dto);

  //   reply.send(response);
  // }

  // async updateRating(req: FastifyRequest, reply: FastifyReply) {
  //   throw new InternalServerError("Not implemented");
  // }

  // async deleteRating(req: FastifyRequest, reply: FastifyReply) {
  //   throw new InternalServerError("Not implemented");
  // }
}
