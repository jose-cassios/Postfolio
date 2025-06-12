import { HttpError } from "../../../Infrastructure/Error/HttpError";

export default class Rating {
  id: string;
  userId: string;
  portfolioId: string;
  score: number;

  constructor(id: string, userId: string, portfolioId: string, score: number) {
    this.id = id;
    this.userId = userId;
    this.portfolioId = portfolioId;

    if (score > 100)
      throw new HttpError(400, "A nota não pode ser maior que 100!");
    if (score < 0) throw new HttpError(400, "A nota não pode ser negativa!");
    this.score = score;
  }
}
