import { CompetitionPort } from "@competition/domain/interfaces/CompetitionPort";
import { TYPES } from "@compositionRoot/Types";
import { UpsertRatingDTO } from "@rating/api/RatingDTO";
import { Rating } from "@rating/domain/entities/Rating";
import { IRatingRepository } from "@rating/domain/interfaces/IRatingRepository";
import { IRatingService } from "@rating/domain/interfaces/IRatingService";
import { InternalServerError, NotFound } from "@shared/error/HttpError";
import { UserPort } from "@user/domain/interfaces/UserPort";
import { ProjectPort } from "@project/domain/interfaces/ProjectPort";
import { inject, injectable } from "inversify";
import { RatingMapper } from "@rating/application/RatingMapper";
import { ProjectCompDetailsPort } from "@projectCompDetails/domain/interfaces/ProjectCompDetailsPort";

@injectable()
export class RatingService implements IRatingService {
  constructor(
    @inject(TYPES.IRatingRepository)
    private ratingRepsotory: IRatingRepository,
    @inject(TYPES.CompetitionPort)
    private competitionPort: CompetitionPort,
    @inject(TYPES.UserPort)
    private userPort: UserPort,
    @inject(TYPES.ProjectPort)
    private projectPort: ProjectPort,
    @inject(TYPES.ProjectCompDetailsPort)
    private projectCompDetailsPort: ProjectCompDetailsPort
  ) {}

  async upsert(dto: UpsertRatingDTO): Promise<Rating> {
    const [user, competition, project, details, rating] = await Promise.all([
      this.userPort.exist(dto.userId),
      this.competitionPort.exist(dto.competitionId),
      this.projectPort.exist(dto.projectId),
      this.projectCompDetailsPort.exist(dto.competitionId, dto.projectId),
      this.ratingRepsotory.findByUserCompetitionProject(
        dto.userId,
        dto.competitionId,
        dto.projectId
      ),
    ]);

    if (!user || !competition || !project || !details)
      throw new NotFound("Dados não encontrados");

    if (!details.id)
      throw new InternalServerError("Não foi possivel realizar a avalição!");

    if (!rating) {
      const newRating = RatingMapper.fromUpsertRatingDTOtoDomain(
        dto,
        details.id
      );

      this.projectCompDetailsPort.recalculate(
        Rating.createDiff(newRating, null)
      );

      return await this.ratingRepsotory.create(newRating);
    }

    const oldRating = rating.copy();

    rating.updateScore(dto.score);

    this.projectCompDetailsPort.recalculate(
      Rating.createDiff(rating, oldRating)
    );

    rating.updateScore(dto.score);
    return this.ratingRepsotory.update(rating);
  }

  async delete(id: string): Promise<Rating | null> {
    const rating = await this.ratingRepsotory.delete(id);

    if (!rating) return null;

    this.projectCompDetailsPort.recalculate(Rating.createDiff(null, rating));

    return rating;
  }

  async findById(id: string): Promise<Rating | null> {
    return await this.ratingRepsotory.findById(id);
  }
}
