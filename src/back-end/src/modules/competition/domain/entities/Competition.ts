import { CreateCompetitionDTO, UpdateCompetionDTO } from "@competition/api/CompetitionDTO";
import { ProjectCategory } from "@project/domain/enum/ProjectCategory";

export class Competition {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public createdAt: Date,
    public startsAt: Date | null = null,
    public endsAt: Date | null = null,
    public category: ProjectCategory = ProjectCategory.OTHER,
    public registrationStartsAt: Date | null = null,
    public registrationEndsAt: Date | null = null,
    public votingStartsAt: Date | null = null,
    public votingEndsAt: Date | null = null,
    public resultsAt: Date | null = null
  ) { }

  static create(dto: CreateCompetitionDTO): Competition {
    return new Competition(
      "",
      dto.name,
      dto.description,
      new Date(),
      dto.registrationStartsAt,
      dto.resultsAt,
      dto.category as ProjectCategory,
      dto.registrationStartsAt,
      dto.registrationEndsAt,
      dto.votingStartsAt,
      dto.votingEndsAt,
      dto.resultsAt
    );
  }

  update(dto: UpdateCompetionDTO): void {
    if (dto.name !== undefined) {
      this.name = dto.name;
    }
    if (dto.description !== undefined) {
      this.description = dto.description;
    }
    if (dto.startsAt !== undefined) {
      this.startsAt = dto.startsAt;
    }
    if (dto.endsAt !== undefined) {
      this.endsAt = dto.endsAt;
    }

  }
}
