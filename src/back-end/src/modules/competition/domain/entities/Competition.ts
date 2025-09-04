import { CreateCompetitionDTO, UpdateCompetionDTO } from "@competition/api/CompetitionDTO";

export class Competition {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public createdAt: Date,
    public startsAt: Date | null = null,
    public endsAt: Date | null = null
  ) { }

  static create(dto: CreateCompetitionDTO): Competition {
    return new Competition("", dto.name, dto.description, new Date());
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

