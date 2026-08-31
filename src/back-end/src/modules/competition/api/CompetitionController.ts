import { CreateCompetitionDTO } from "@competition/api/CompetitionDTO";
import {
  CompetitionProjectRequest,
  CreateCompetitionRequest,
  EventEvaluationRequest,
} from "@competition/api/CompetitionSchema";
import { ICompetitionService } from "@competition/domain/interfaces/ICompetitionService";
import { TYPES } from "@compositionRoot/Types";
import { BadRequest, Unauthorized } from "@shared/error/HttpError";
import { FastifyReply, FastifyRequest } from "fastify";
import { inject, injectable } from "inversify";

@injectable()
export class CompetitionController {
  constructor(
    @inject(TYPES.ICompetitionService)
    private competitionService: ICompetitionService
  ) {}

  async create(req: CreateCompetitionRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new Unauthorized("Usuario precisa fazer login.");
    const dto: CreateCompetitionDTO = { ...req.body };
    reply.status(201).send(await this.competitionService.create(dto, userId));
  }

  async getAll(_req: FastifyRequest, reply: FastifyReply) {
    reply.send(await this.competitionService.findContracts());
  }

  async getCompetition(req: FastifyRequest, reply: FastifyReply) {
    const { competitionId } = req.params as { competitionId?: string };
    if (!competitionId) throw new BadRequest("ID da competicao e obrigatorio.");
    reply.send(await this.competitionService.findContractById(competitionId));
  }

  async subscribeProject(req: CompetitionProjectRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new Unauthorized("Usuario precisa fazer login.");
    await this.competitionService.subscribeProject(
      req.params.competitionId,
      req.params.projectId,
      userId
    );
    reply.status(201).send({ message: "Projeto inscrito com sucesso." });
  }

  async unsubscribeProject(req: CompetitionProjectRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new Unauthorized("Usuario precisa fazer login.");
    await this.competitionService.unsubscribeProject(
      req.params.competitionId,
      req.params.projectId,
      userId
    );
    reply.send({ message: "Inscricao removida." });
  }

  async evaluate(req: EventEvaluationRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    if (!userId) throw new Unauthorized("Usuario precisa fazer login.");
    await this.competitionService.evaluate(
      req.params.competitionId,
      req.params.projectId,
      userId,
      req.body.scores,
    );
    reply.status(201).send({ message: "Avaliacao registrada." });
  }

  async evaluationProgress(req: FastifyRequest, reply: FastifyReply) {
    const userId = req.user?.id;
    const { competitionId } = req.params as { competitionId?: string };
    if (!userId) throw new Unauthorized("Usuario precisa fazer login.");
    if (!competitionId) throw new BadRequest("ID da competicao e obrigatorio.");
    reply.send(await this.competitionService.getEvaluationProgress(
      competitionId,
      userId,
    ));
  }
}
