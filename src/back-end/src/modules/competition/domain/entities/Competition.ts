import { CreateCompetitionDTO } from "@competition/api/CompetitionDTO";

export class Competition {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public createdAt: Date,
    public startsAt: Date | null = null,
    public endsAt: Date | null = null
  ) {}

  static create(dto: CreateCompetitionDTO): Competition {
    return new Competition("", dto.name, dto.description, new Date());
  }
}
