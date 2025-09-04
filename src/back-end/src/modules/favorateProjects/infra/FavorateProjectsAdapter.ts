import { TYPES } from "@compositionRoot/Types";
import { FavorateProjectsPort } from "@favorateProjects/domain/interfaces/FavorateProjectsPort";
import { IFavorateProjectsRepository } from "@favorateProjects/domain/interfaces/IFavorateProjectsRepository";
import { FavorateProjectsContract } from "@shared/contracts/FavorateProjectsContract";
import { inject, injectable } from "inversify";

@injectable()
export class FavorateProjectsAdapter implements FavorateProjectsPort {
  constructor(
    @inject(TYPES.IFavorateProjectsRepository)
    private repository: IFavorateProjectsRepository
  ) {}

  async getByUserId(userId: string): Promise<FavorateProjectsContract[]> {
    return await this.repository.findByUserId(userId);
  }
}
