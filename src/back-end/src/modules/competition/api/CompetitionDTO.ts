export interface CreateCompetitionDTO {
  name: string;
  description: string;
}

export interface UpdateCompetionDTO {
  id: string
  name?: string;
  description?: string;
  startsAt?: Date;
  endsAt?: Date;
}