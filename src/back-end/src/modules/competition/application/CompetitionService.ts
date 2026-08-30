import { CompetitionContract, CreateCompetitionDTO } from "@competition/api/CompetitionDTO";
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
    if (!(await this.userPort.isAdmin(userId))) {
      throw new Forbidden("Apenas administradores podem criar competicoes.");
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
    await this.competitionRepository.subscribeProject(competitionId, projectId);
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

  async vote(competitionId: string, projectId: string, userId: string) {
    const competition = await this.findContractById(competitionId);
    if (competition.status !== "VOTING") {
      throw new Conflict("A votacao nao esta aberta.");
    }
    if (!competition.submissions.some((project) => project.id === projectId)) {
      throw new NotFound("O projeto nao participa desta competicao.");
    }
    if (competition.submissions.some((project) => project.author.id === userId)) {
      throw new Forbidden("Participantes desta competicao nao podem votar.");
    }
    await this.competitionRepository.vote(competitionId, projectId, userId);
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
