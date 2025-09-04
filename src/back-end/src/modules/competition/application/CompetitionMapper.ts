import { Competition as CompetitionModel } from "@prisma/client";
import { Competition } from "@competition/domain/entities/Competition";

export const CompetitionMapper = {
  fromPrismaToDomain(model: CompetitionModel): Competition {
    return new Competition(
      model.id,
      model.name,
      model.description,
      model.createdAt,
      model.startsAt,
      model.endsAt
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
    };
  },
};
