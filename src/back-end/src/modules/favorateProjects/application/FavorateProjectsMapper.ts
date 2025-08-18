import { FavorateProjects } from "@favorateProjects/domain/entities/FavorateProjects";
import { FavorateProjects as FavorateProjectsModel } from "@prisma/client";

export const FavorateProjectsMapper = {
  fromDomainToPrisma(domain: FavorateProjects): FavorateProjectsModel {
    return {
      id: domain.getId(),
      projectId: domain.getProjectId(),
      userId: domain.getUserId(),
    };
  },

  fromPrismaToDomain(model: FavorateProjectsModel): FavorateProjects {
    return new FavorateProjects(model.id, model.userId, model.projectId);
  },
};
