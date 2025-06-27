import { BadRequest } from "@domain/error/HttpError";

export default class Rating {
  id: string;
  userId: string;
  portfolioId: string;
  score: number;

  constructor(id: string, userId: string, portfolioId: string, score: number) {
    this.id = id;
    this.userId = userId;
    this.portfolioId = portfolioId;

    if (score > 100) throw new BadRequest("A nota não pode ser maior que 100!");
    if (score < 0) throw new BadRequest("A nota não pode ser negativa!");
    this.score = score;
  }
}
