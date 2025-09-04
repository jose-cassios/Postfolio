import {
  CreateFavorateProjectDTO,
  DeleteFavorateProjectDTO,
} from "@favorateProjects/api/FavorateProjectsDTO";

export interface IFavorateProjectsService {
  create(dto: CreateFavorateProjectDTO): Promise<void>;
  delete(dto: DeleteFavorateProjectDTO): Promise<void>;
}
