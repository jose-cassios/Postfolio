import { TYPES } from "@compositionRoot/Types";
import {
  CreateFavorateProjectDTO,
  DeleteFavorateProjectDTO,
} from "@favorateProjects/api/FavorateProjectsDTO";
import { IFavorateProjectsRepository } from "@favorateProjects/domain/interfaces/IFavorateProjectsRepository";
import { IFavorateProjectsService } from "@favorateProjects/domain/interfaces/IFavorateProjectsService";
import { ProjectPort } from "@project/domain/interfaces/ProjectPort";
import { Conflict, NotFound } from "@shared/error/HttpError";
import { inject, injectable } from "inversify";
import { FavorateProjectsMapper } from "@favorateProjects/application/FavorateProjectsMapper";

@injectable()
export class FavorateProjectsService implements IFavorateProjectsService {
  constructor(
    @inject(TYPES.IFavorateProjectsRepository)
    private repository: IFavorateProjectsRepository,
    @inject(TYPES.ProjectPort)
    private projectPort: ProjectPort
  ) {}

  async create(dto: CreateFavorateProjectDTO): Promise<void> {
    const [favorate, project] = await Promise.all([
      this.repository.findByUserIdAndProjectId(dto.userId, dto.projectId),
      this.projectPort.exist(dto.projectId),
    ]);

    // const favorate = await this.repository.findByUserIdAndProjectId(
    //   dto.userId,
    //   dto.projectId
    // );
    if (!project) throw new NotFound("O projeto não existe!");
    if (!favorate) throw new Conflict("O projeto já está salvo!");

    await this.repository.create(
      FavorateProjectsMapper.fromCreateFavorateProjectDTO(dto)
    );
  }
  async delete(dto: DeleteFavorateProjectDTO): Promise<void> {
    const favorate = await this.repository.findByUserIdAndProjectId(
      dto.userId,
      dto.projectId
    );

    if (!favorate) return;

    await this.repository.delete(favorate);
  }
}
