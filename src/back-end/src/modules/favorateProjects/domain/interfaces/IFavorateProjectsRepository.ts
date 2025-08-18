import { FavorateProjects } from "@favorateProjects/domain/entities/FavorateProjects";
import { FavorateProjectsContract } from "@shared/contracts/FavorateProjectsContract";

export interface IFavorateProjectsRepository {
  create(favorate: FavorateProjects): Promise<FavorateProjects>;
  delete(favorate: FavorateProjects): Promise<FavorateProjects>;

  findByUserId(userId: string): Promise<FavorateProjectsContract[]>;
  findByUserIdAndProjectId(
    userId: string,
    projectId: string
  ): Promise<FavorateProjects | null>;
}
