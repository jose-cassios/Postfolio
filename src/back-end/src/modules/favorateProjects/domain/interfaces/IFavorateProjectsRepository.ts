import { FavorateProjects } from "@favorateProjects/domain/entities/FavorateProjects";

export interface IFavorateProjectsRepository {
  create(favorate: FavorateProjects): Promise<FavorateProjects>;
  delete(favorate: FavorateProjects): Promise<FavorateProjects>;

  findByUserId(userId: string): Promise<FavorateProjects[]>;
  findByUserIdAndProjectId(
    userId: string,
    projectId: string
  ): Promise<FavorateProjects | null>;
}
