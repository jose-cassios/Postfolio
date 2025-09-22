import { Competition } from "@competition/domain/entities/Competition";
import { ICompetitionRepository } from "@competition/domain/interfaces/ICompetitionRepository";
import { ICompetitionService } from "@competition/domain/interfaces/ICompetitionService";
import { TYPES } from "@compositionRoot/Types";
import { Conflict, NotFound } from "@shared/error/HttpError";
import { UserPort } from "@user/domain/interfaces/UserPort";
import { ProjectPort } from "@project/domain/interfaces/ProjectPort";
import { inject, injectable } from "inversify";
import { ProjectCompDetailsPort } from "@projectCompDetails/domain/interfaces/ProjectCompDetailsPort";
import { ProjectContract } from "@shared/contracts/ProjectContracts";
import { CreateCompetitionDTO } from "@competition/api/CompetitionDTO";

@injectable()
export class CompetitionService implements ICompetitionService {
  constructor(
    @inject(TYPES.ICompetitionRepository)
    private competitionRepository: ICompetitionRepository,
    @inject(TYPES.ProjectPort)
    private projectPort: ProjectPort,
    @inject(TYPES.UserPort)
    private userPort: UserPort,
    @inject(TYPES.ProjectCompDetailsPort)
    private projectCompDetailsPort: ProjectCompDetailsPort
  ) {}

  async create(dto: CreateCompetitionDTO): Promise<Competition> {
    const competition = Competition.create(dto);
    return await this.competitionRepository.create(competition);
  }

  async update(competition: Competition): Promise<Competition> {
    return await this.competitionRepository.update(competition);
  }

  async delete(id: string): Promise<Competition | null> {
    return await this.competitionRepository.deleteById(id);
  }

  async subscribeProject(
    competitionId: string,
    projectId: string
  ): Promise<void> {
    const [competition, project, details] = await Promise.all([
      this.competitionRepository.findById(competitionId),
      this.projectPort.exist(projectId),
      this.projectCompDetailsPort.exist(competitionId, projectId),
    ]);

    if (!competition) throw new NotFound("A competição não foi encontrada");
    if (!project) throw new NotFound("O trabalho não pode ser encontrado");

    if (details)
      throw new Conflict("O tralho já está cadastrado na competição");

    await this.projectCompDetailsPort.create({
      id: "",
      totalReviewers: 0,
      totalScore: 0,
      competitionId: competition.id,
      projectId: project,
      checked: true,
    });
  }

  async unsubscribeProject(
    competitionId: string,
    projectId: string
  ): Promise<void> {
    const details = await this.projectCompDetailsPort.exist(
      competitionId,
      projectId
    );

    if (!details)
      throw new NotFound(
        "Inscrição não encontrada para esta competição e projeto"
      );

    const response = await this.projectCompDetailsPort.delete(
      competitionId,
      projectId
    );
  }

  async findMany(): Promise<Competition[]> {
    return await this.competitionRepository.findMany();
  }

  async findById(id: string): Promise<Competition | null> {
    return await this.competitionRepository.findById(id);
  }

  findSubscribedProjects(competitionId: string): Promise<ProjectContract[]> {
    throw new Error("Method not implemented.");
  }
  findProjecWithDetails(
    competitionId: string,
    projectId: string
  ): Promise<ProjectContract | null> {
    throw new Error("Method not implemented.");
  }
}
