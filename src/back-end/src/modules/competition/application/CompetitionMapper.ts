import { Competition as CompetitionModel } from "@PrismaGen/client";
import { Competition } from "@competition/domain/entities/Competition";
import { ProjectCategoryMapper } from "@project/application/ProjectMapper";

export const CompetitionMapper = {
  fromPrismaToDomain(model: CompetitionModel): Competition {
    return new Competition(
      model.id,
      model.name,
      model.description,
      model.createdAt,
      model.startsAt,
      model.endsAt,
      ProjectCategoryMapper.fromPrismaToDomain(model.category),
      model.registrationStartsAt,
      model.registrationEndsAt,
      model.votingStartsAt,
      model.votingEndsAt,
      model.resultsAt,
      model.minimumEvaluations,
    );
  },
  fromDomainToPrisma(domain: Competition): CompetitionModel {
    return {
      id: domain.id,
      name: domain.name,
      description: domain.description,
      createdAt: domain.createdAt,
      startsAt: domain.startsAt,
      endsAt: domain.endsAt,
      category: ProjectCategoryMapper.fromDomainToPrisma(domain.category),
      registrationStartsAt: domain.registrationStartsAt,
      registrationEndsAt: domain.registrationEndsAt,
      votingStartsAt: domain.votingStartsAt,
      votingEndsAt: domain.votingEndsAt,
      resultsAt: domain.resultsAt,
      minimumEvaluations: domain.minimumEvaluations,
    };
  },
};
