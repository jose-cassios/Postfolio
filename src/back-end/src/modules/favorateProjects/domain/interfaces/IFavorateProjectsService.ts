import {
  CreateFavorateProjectDTO,
  DeleteFavorateProjectDTO,
} from "@favorateProjects/api/FavorateProjectsDTO";
import { FavorateProjectsContract } from "@shared/contracts/FavorateProjectsContract";

export interface IFavorateProjectsService {
  create(dto: CreateFavorateProjectDTO): Promise<void>;
  delete(dto: DeleteFavorateProjectDTO): Promise<void>;
  findByUserId(userId: string): Promise<FavorateProjectsContract[]>;
}
