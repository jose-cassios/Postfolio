import {
  BadRequest,
  Conflict,
  InternalServerError,
} from "@shared/error/HttpError";

type RatingData = {
  id: string;
  score: number;
  userId: string;
  projectId: string;
  competitionId: string;
  projectCompDetailsId: string;
};

// import { Rating } from '../competition/domain/entities/Rating';
export class Rating {
  constructor(
    private id: string,
    private score: number,
    private userId: string,
    private projectId: string,
    private competitionId: string,
    private projectCompDetailsId: string
  ) {
    this.validateScore(score);
    this.id = id;
    this.score = score;
  }

  public static createDiff(newRating: Rating | null, oldRating: Rating | null) {
    if (!newRating && !oldRating)
      throw new InternalServerError("Ambos as intancias são nulls!");

    if (newRating?.getCompetitionId() !== oldRating?.getCompetitionId())
      throw new Conflict("Recursos em conflito em rating!");

    if (newRating && !oldRating) {
      return {
        competitionId: newRating.getCompetitionId(),
        projectId: newRating.getProjectId(),
        scoreDiff: newRating.getScore(),
        reviewersDiff: 1,
      };
    }

    if (newRating && oldRating) {
      return {
        competitionId: newRating.getCompetitionId(),
        projectId: newRating.getProjectId(),
        scoreDiff: newRating.getScore() - oldRating.getScore(),
        reviewersDiff: 0,
      };
    }

    if (!newRating && oldRating) {
      return {
        competitionId: oldRating.getCompetitionId(),
        projectId: oldRating.getProjectId(),
        scoreDiff: -oldRating.getScore(),
        reviewersDiff: -1,
      };
    }

    throw new InternalServerError("Ocorrou um erro inesperado em avaliações!");
  }

  public updateScore(score: number) {
    this.validateScore(score);
    this.score = score;
  }

  private validateScore(score: number) {
    if (score > 5) throw new BadRequest("A nota não pode ser maior que 5!");
    if (score < 0) throw new BadRequest("A nota não pode ser negativa!");
  }

  public copy(): Rating {
    return new Rating(
      this.id,
      this.score,
      this.userId,
      this.projectId,
      this.competitionId,
      this.projectCompDetailsId
    );
  }

  public getId(): string {
    return this.id;
  }

  public getScore(): number {
    return this.score;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getProjectId(): string {
    return this.projectId;
  }

  public getCompetitionId(): string {
    return this.competitionId;
  }

  public getProjectCompDetailsId(): string {
    return this.projectCompDetailsId;
  }
}
