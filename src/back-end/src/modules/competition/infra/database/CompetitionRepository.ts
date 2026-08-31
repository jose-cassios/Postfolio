import { InternalServerError } from "@shared/error/HttpError";
import { prisma } from "@infrastructure/config/Prisma";
import { Prisma, ProjectStatus } from "@PrismaGen/client";
import { Competition } from "@competition/domain/entities/Competition";
import { CompetitionMapper } from "@competition/application/CompetitionMapper";
import { ICompetitionRepository } from "@competition/domain/interfaces/ICompetitionRepository";
import {
  CompetitionContract,
  EvaluationProgressContract,
  EventEvaluationInput,
} from "@competition/api/CompetitionDTO";
import { Conflict, NotFound } from "@shared/error/HttpError";
Competition;

export class PrismaCompetitionRepository implements ICompetitionRepository {
  async create(competition: Competition): Promise<Competition> {
    try {
      const model = await prisma.competition.create({
        data: {
          ...CompetitionMapper.fromDomainToPrisma(competition),
          id: undefined,
          criteria: {
            create: competition.criteria.map((criterion, position) => ({
              name: criterion.name,
              weight: criterion.weight,
              position,
            })),
          },
        },
      });
      return CompetitionMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel salvar a competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel salvar a competição!");
    }
  }

  async update(competition: Competition): Promise<Competition> {
    try {
      const competitionModel = await prisma.competition.update({
        where: {
          id: competition.id,
        },
        data: { ...CompetitionMapper.fromDomainToPrisma(competition) },
      });
      return CompetitionMapper.fromPrismaToDomain(competitionModel);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel atualizar a competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel atualizar a competição!");
    }
  }

  async deleteById(id: string): Promise<Competition | null> {
    try {
      const competitionModel = await prisma.competition.delete({
        where: {
          id,
        },
      });
      return CompetitionMapper.fromPrismaToDomain(competitionModel);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel deletar a competição! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Não foi possivel deletar a competição!");
    }
  }

  async findMany(): Promise<Competition[]> {
    const competitionModels = await prisma.competition.findMany();
    return competitionModels.map(CompetitionMapper.fromPrismaToDomain);
  }

  async findContracts(): Promise<CompetitionContract[]> {
    const models = await prisma.competition.findMany({
      orderBy: { registrationStartsAt: "desc" },
      include: this.contractInclude(),
    });
    return models.map((model) => this.toContract(model));
  }

  async findContractById(id: string): Promise<CompetitionContract | null> {
    const model = await prisma.competition.findUnique({
      where: { id },
      include: this.contractInclude(),
    });
    return model ? this.toContract(model) : null;
  }

  async subscribeProject(competitionId: string, projectId: string): Promise<void> {
    await prisma.projectCompDetails.create({
      data: { competitionId, projectId, totalReviewers: 0, totalScore: 0 },
    });
  }

  async unsubscribeProject(competitionId: string, projectId: string): Promise<void> {
    await prisma.projectCompDetails.delete({
      where: { competitionId_projectId: { competitionId, projectId } },
    });
  }

  async upsertEvaluation(
    competitionId: string,
    projectId: string,
    userId: string,
    scores: EventEvaluationInput[],
  ): Promise<void> {
    await prisma.$transaction(async (tx) => {
      const evaluation = await tx.eventEvaluation.upsert({
        where: {
          competitionId_projectId_evaluatorId: {
            competitionId,
            projectId,
            evaluatorId: userId,
          },
        },
        update: {},
        create: { competitionId, projectId, evaluatorId: userId },
      });
      await tx.eventEvaluationScore.deleteMany({
        where: { evaluationId: evaluation.id },
      });
      await tx.eventEvaluationScore.createMany({
        data: scores.map((score) => ({
          evaluationId: evaluation.id,
          criterionId: score.criterionId,
          score: score.score,
        })),
      });
    });
  }

  async getEvaluationProgress(
    competitionId: string,
    userId: string,
  ): Promise<EvaluationProgressContract> {
    const [competition, evaluatedProjects] = await Promise.all([
      prisma.competition.findUniqueOrThrow({
        where: { id: competitionId },
        select: {
          minimumEvaluations: true,
          worksDetails: {
            select: {
              project: { select: { portfolio: { select: { authorId: true } } } },
            },
          },
        },
      }),
      prisma.eventEvaluation.count({
        where: { competitionId, evaluatorId: userId },
      }),
    ]);
    const ownedProjects = competition.worksDetails.filter(
      (details) => details.project.portfolio.authorId === userId,
    ).length;
    const participant = ownedProjects > 0;
    const eligibleProjects = Math.max(0, competition.worksDetails.length - ownedProjects);
    const requiredEvaluations = participant
      ? Math.min(competition.minimumEvaluations, eligibleProjects)
      : 0;
    return {
      participant,
      evaluatedProjects,
      requiredEvaluations,
      completed: !participant || evaluatedProjects >= requiredEvaluations,
    };
  }

  async findById(id: string): Promise<Competition | null> {
    const competitionModel = await prisma.competition.findUnique({
      where: {
        id,
      },
    });

    return competitionModel
      ? CompetitionMapper.fromPrismaToDomain(competitionModel)
      : null;
  }

  private contractInclude() {
    return {
      worksDetails: {
        where: { project: { status: ProjectStatus.PUBLISHED } },
        include: {
          project: {
            include: {
              portfolio: { include: { author: { select: { id: true, username: true } } } },
            },
          },
        },
      },
      criteria: { orderBy: { position: "asc" } },
      evaluations: {
        include: { scores: true },
      },
    } satisfies Prisma.CompetitionInclude;
  }

  private toContract(model: any): CompetitionContract {
    const criteria = model.criteria as Array<{
      id: string;
      name: string;
      weight: number;
      position: number;
      createdAt: Date;
      competitionId: string;
    }>;
    const evaluations = model.evaluations as Array<{
      projectId: string;
      scores: Array<{ criterionId: string; score: number }>;
    }>;
    const now = new Date();
    const status = !model.registrationStartsAt || now < model.registrationStartsAt
      ? "UPCOMING"
      : now <= model.registrationEndsAt
        ? "REGISTRATION"
        : now < model.votingStartsAt
          ? "WAITING_VOTING"
          : now <= model.votingEndsAt
            ? "VOTING"
            : model.resultsAt && now < model.resultsAt
              ? "WAITING_RESULTS"
              : "RESULTS";
    const resultsVisible = status === "RESULTS";
    const criterionIds = new Set(criteria.map((criterion) => criterion.id));
    const totalWeight = criteria.reduce((total, criterion) => total + criterion.weight, 0) || 1;
    const primaryCriterion = [...criteria].sort(
      (left, right) => right.weight - left.weight || left.position - right.position,
    )[0];
    const scoreByProject = new Map<string, {
      score: number;
      primaryCriterionScore: number;
      evaluationCount: number;
    }>();
    for (const details of model.worksDetails) {
      const projectEvaluations = evaluations.filter((evaluation) => {
        if (evaluation.projectId !== details.project.id) return false;
        const submitted = new Set(evaluation.scores.map((score) => score.criterionId));
        return submitted.size === criterionIds.size
          && [...criterionIds].every((criterionId) => submitted.has(criterionId));
      });
      const weightedScores = projectEvaluations.map((evaluation) =>
        evaluation.scores.reduce((total, score) => {
          const criterion = criteria.find((item) => item.id === score.criterionId);
          return total + score.score * (criterion?.weight ?? 0);
        }, 0) / totalWeight
      );
      const primaryScores = projectEvaluations.flatMap((evaluation) => {
        const score = evaluation.scores.find(
          (item) => item.criterionId === primaryCriterion?.id,
        );
        return score ? [score.score] : [];
      });
      scoreByProject.set(details.project.id, {
        score: this.average(weightedScores),
        primaryCriterionScore: this.average(primaryScores),
        evaluationCount: projectEvaluations.length,
      });
    }
    const ordered = resultsVisible
      ? [...model.worksDetails].sort((left, right) => {
          const leftScore = scoreByProject.get(left.project.id)!;
          const rightScore = scoreByProject.get(right.project.id)!;
          return rightScore.score - leftScore.score
            || rightScore.primaryCriterionScore - leftScore.primaryCriterionScore
            || rightScore.evaluationCount - leftScore.evaluationCount;
        })
      : [...model.worksDetails];
    let previousResult: string | null = null;
    let currentRank = 0;
    return {
      id: model.id,
      name: model.name,
      description: model.description,
      category: model.category,
      createdAt: model.createdAt,
      registrationStartsAt: model.registrationStartsAt,
      registrationEndsAt: model.registrationEndsAt,
      votingStartsAt: model.votingStartsAt,
      votingEndsAt: model.votingEndsAt,
      resultsAt: model.resultsAt,
      status,
      minimumEvaluations: model.minimumEvaluations,
      criteria,
      submissions: ordered.map((details, index) => {
        const result = scoreByProject.get(details.project.id)!;
        const resultKey = `${result.score}:${result.primaryCriterionScore}:${result.evaluationCount}`;
        if (resultKey !== previousResult) currentRank = index + 1;
        previousResult = resultKey;
        return {
          id: details.project.id,
          name: details.project.name,
          coverImageUrl: details.project.coverImageUrl,
          tools: details.project.tools,
          author: details.project.portfolio.author,
          ...(resultsVisible
            ? {
                score: Number(result.score.toFixed(2)),
                primaryCriterionScore: Number(result.primaryCriterionScore.toFixed(2)),
                evaluationCount: result.evaluationCount,
                rank: result.evaluationCount > 0 && currentRank <= 3
                  ? currentRank
                  : undefined,
              }
            : {}),
        };
      }),
    };
  }

  private average(values: number[]): number {
    return values.length
      ? values.reduce((total, value) => total + value, 0) / values.length
      : 0;
  }
}
