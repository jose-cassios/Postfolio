import { FavorateProjectsContract } from "@shared/contracts/FavorateProjectsContract";

export interface FavorateProjectsPort {
  getByUserId(userId: string): Promise<FavorateProjectsContract[]>;
}
