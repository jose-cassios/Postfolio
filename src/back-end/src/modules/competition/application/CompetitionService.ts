import { CompetitionContract, CreateCompetitionDTO, EventEvaluationInput } from "@competition/api/CompetitionDTO";
import { Competition } from "@competition/domain/entities/Competition";
import { ICompetitionRepository } from "@competition/domain/interfaces/ICompetitionRepository";
import { ICompetitionService } from "@competition/domain/interfaces/ICompetitionService";
import { TYPES } from "@compositionRoot/Types";
import { ProjectPort } from "@project/domain/interfaces/ProjectPort";
import { Conflict, Forbidden, NotFound } from "@shared/error/HttpError";
import { UserPort } from "@user/domain/interfaces/UserPort";
import { inject, injectable } from "inversify";

@injectable()
export class CompetitionService implements ICompetitionService {
  constructor(
    @inject(TYPES.ICompetitionRepository)
    private competitionRepository: ICompetitionRepository,
    @inject(TYPES.ProjectPort)
    private projectPort: ProjectPort,
    @inject(TYPES.UserPort)
    private userPort: UserPort
  ) {}

  async create(dto: CreateCompetitionDTO, userId: string): Promise<Competition> {
    if (!(await this.userPort.canManageCompetitions(userId))) {
      throw new Forbidden("Apenas administradores e moderadores podem criar competicoes.");
    }
    return await this.competitionRepository.create(Competition.create(dto));
  }

  async update(competition: Competition): Promise<Competition> {
    return await this.competitionRepository.update(competition);
  }

  async delete(id: string): Promise<Competition | null> {
    return await this.competitionRepository.deleteById(id);
  }

  async subscribeProject(competitionId: string, projectId: string, userId: string) {
    const competition = await this.findContractById(competitionId);
    if (competition.status !== "REGISTRATION") {
      throw new Conflict("As inscricoes nao estao abertas.");
    }
    if (!(await this.projectPort.isOwnedBy(projectId, userId))) {
      throw new Forbidden("Voce so pode inscrever os proprios projetos.");
    }
    if (competition.submissions.some((project) => project.id === projectId)) {
      throw new Conflict("O projeto ja esta inscrito.");
    }
    await this.competitionRepository.subscribeProject(competitionId, projectId, userId);
  }

  async unsubscribeProject(competitionId: string, projectId: string, userId: string) {
    const competition = await this.findContractById(competitionId);
    if (competition.status !== "REGISTRATION") {
      throw new Conflict("As inscricoes nao estao abertas.");
    }
    if (!(await this.projectPort.isOwnedBy(projectId, userId))) {
      throw new Forbidden("Voce so pode remover os proprios projetos.");
    }
    await this.competitionRepository.unsubscribeProject(competitionId, projectId);
  }

  async evaluate(
    competitionId: string,
    projectId: string,
    userId: string,
    scores: EventEvaluationInput[],
  ) {
    const competition = await this.findContractById(competitionId);
    if (competition.status !== "VOTING") {
      throw new Conflict("A fase de avaliacao nao esta aberta.");
    }
    const project = competition.submissions.find((submission) => submission.id === projectId);
    if (!project) {
      throw new NotFound("O projeto nao participa desta competicao.");
    }
    if (project.author.id === userId) {
      throw new Forbidden("Voce nao pode avaliar o proprio projeto.");
    }
    const expectedCriteria = new Set(competition.criteria.map((criterion) => criterion.id));
    const submittedCriteria = new Set(scores.map((score) => score.criterionId));
    if (
      expectedCriteria.size !== submittedCriteria.size
      || [...expectedCriteria].some((criterionId) => !submittedCriteria.has(criterionId))
    ) {
      throw new Conflict("Avalie todos os criterios configurados para o evento.");
    }
    await this.competitionRepository.upsertEvaluation(
      competitionId,
      projectId,
      userId,
      scores,
    );
  }

  async getEvaluationProgress(competitionId: string, userId: string) {
    await this.findContractById(competitionId);
    return await this.competitionRepository.getEvaluationProgress(competitionId, userId);
  }

  findMany(): Promise<Competition[]> {
    return this.competitionRepository.findMany();
  }

  findById(id: string): Promise<Competition | null> {
    return this.competitionRepository.findById(id);
  }

  findContracts(): Promise<CompetitionContract[]> {
    return this.competitionRepository.findContracts();
  }

  async findContractById(id: string): Promise<CompetitionContract> {
    const competition = await this.competitionRepository.findContractById(id);
    if (!competition) throw new NotFound("A competicao nao foi encontrada.");
    return competition;
  }

}
