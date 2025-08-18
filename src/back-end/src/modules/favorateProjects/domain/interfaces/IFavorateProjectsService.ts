import { CreateFavorateProjectDTO } from "@favorateProjects/api/FavorateProjectsDTO";

export interface IFavorateProjectsService {
  create(dto: CreateFavorateProjectDTO): Promise<void>;
  delete(id: string): Promise<void>;
}
