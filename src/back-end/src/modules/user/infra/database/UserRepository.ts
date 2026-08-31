// import PrismaUser from "@models/PrismaUser";
import User from "@user/domain/entities/User";
import { prisma } from "@infrastructure/config/Prisma";
import { InternalServerError } from "@shared/error/HttpError";
import {
  AppreciateStatus,
  Prisma,
  ProjectStatus,
  ReputationAxis,
} from "@PrismaGen/client";
import { UserMapper } from "@user/application/UserMapper";
import { resolveReputationRank } from "@user/application/ReputationRanks";
import { IUserRepository } from "@user/domain/interfaces/IUserRepository";
import Email from "@user/domain/valueObject/Email";
import { UserAchievementContract, UserReputationContract } from "@shared/contracts/UserContracts";

export class UserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    try {
      const userModel = await prisma.user.create({
        data: { ...UserMapper.fromDomaintoPrisma(user), id: undefined },
      });
      return UserMapper.fromPrismaToDomain(userModel);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel salvar o usuario! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao registrar usuario!");
    }
  }

  async updateById(user: User): Promise<User> {
    const model = await prisma.user.update({
      where: { id: user.getId() },
      data: { ...UserMapper.fromDomaintoPrisma(user) },
    });

    return UserMapper.fromPrismaToDomain(model);
  }

  async deleteById(id: string): Promise<User | null> {
    try {
      const userModel = await prisma.user.delete({
        where: { id },
      });
      return userModel ? UserMapper.fromPrismaToDomain(userModel) : null;
    } catch (error) {
      throw new InternalServerError("Não foi possivel deletar usuario!");
    }
  }

  async findMany(): Promise<User[]> {
    const userModels = await prisma.user.findMany();
    return userModels.map(UserMapper.fromPrismaToDomain);
  }

  async findById(id: string): Promise<User | null> {
    const userModel = await prisma.user.findUnique({ where: { id } });
    return userModel ? UserMapper.fromPrismaToDomain(userModel) : null;
  }

  async findByEmail(email: Email): Promise<User | null> {
    const userModel = await prisma.user.findUnique({
      where: { email: email.getValue() },
    });
    return userModel ? UserMapper.fromPrismaToDomain(userModel) : null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const userModel = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });
    return userModel ? UserMapper.fromPrismaToDomain(userModel) : null;
  }

  async findAchievements(userId: string): Promise<UserAchievementContract[]> {
    const competitions = await prisma.competition.findMany({
      where: { resultsAt: { lte: new Date() } },
      include: {
        criteria: true,
        evaluations: { include: { scores: true } },
        worksDetails: {
          select: {
            projectId: true,
            project: { select: { portfolio: { select: { authorId: true } } } },
          },
        },
      },
    });

    return competitions.flatMap((competition) => {
      const criteriaIds = new Set(competition.criteria.map((criterion) => criterion.id));
      const totalWeight = competition.criteria.reduce(
        (total, criterion) => total + criterion.weight,
        0,
      ) || 1;
      const primary = [...competition.criteria].sort(
        (left, right) => right.weight - left.weight || left.position - right.position,
      )[0];
      const results = competition.worksDetails.map((details) => {
        const evaluations = competition.evaluations.filter((evaluation) => {
          const submitted = new Set(evaluation.scores.map((score) => score.criterionId));
          return evaluation.projectId === details.projectId
            && submitted.size === criteriaIds.size
            && [...criteriaIds].every((id) => submitted.has(id));
        });
        const weighted = evaluations.map((evaluation) =>
          evaluation.scores.reduce((total, score) => {
            const criterion = competition.criteria.find((item) => item.id === score.criterionId);
            return total + score.score * (criterion?.weight ?? 0);
          }, 0) / totalWeight
        );
        const primaryScores = evaluations.flatMap((evaluation) => {
          const score = evaluation.scores.find((item) => item.criterionId === primary?.id);
          return score ? [score.score] : [];
        });
        const average = (values: number[]) => values.length
          ? values.reduce((total, value) => total + value, 0) / values.length
          : 0;
        return {
          details,
          score: average(weighted),
          primaryScore: average(primaryScores),
          evaluations: evaluations.length,
        };
      }).sort((left, right) =>
        right.score - left.score
        || right.primaryScore - left.primaryScore
        || right.evaluations - left.evaluations
      );

      let previousResult: string | null = null;
      let rank = 0;
      return results.flatMap((result, index) => {
        const resultKey = `${result.score}:${result.primaryScore}:${result.evaluations}`;
        if (resultKey !== previousResult) rank = index + 1;
        previousResult = resultKey;
        return result.details.project.portfolio.authorId === userId &&
          result.evaluations > 0 &&
          rank <= 3
          ? [{ competitionId: competition.id, competitionName: competition.name, rank }]
          : [];
      });
    });
  }

  async findReputation(userId: string): Promise<UserReputationContract> {
    const [scores, rankThresholds, publishedProjects, versionsCreated, postmarksSent,
      usefulFeedbacks, appliedSuggestions, recognizedContributions] = await Promise.all([
      prisma.reputationEvent.groupBy({
        by: ["axis"],
        where: { userId },
        _sum: { points: true },
      }),
      prisma.reputationRankConfig.findMany({
        select: { rank: true, requiredXp: true },
      }),
      prisma.project.count({
        where: {
          status: ProjectStatus.PUBLISHED,
          portfolio: { authorId: userId },
        },
      }),
      prisma.projectVersion.count({ where: { authorId: userId } }),
      prisma.appreciate.count({ where: { userId } }),
      prisma.appreciate.count({
        where: {
          userId,
          status: { in: [AppreciateStatus.USEFUL, AppreciateStatus.APPLIED] },
        },
      }),
      prisma.appreciate.count({
        where: { userId, status: AppreciateStatus.APPLIED },
      }),
      prisma.projectVersionCredit.count({ where: { contributorId: userId } }),
    ]);
    const xp = (axis: ReputationAxis) =>
      scores.find((item) => item.axis === axis)?._sum.points ?? 0;
    const creatorXp = xp(ReputationAxis.CREATOR);
    const contributorXp = xp(ReputationAxis.CONTRIBUTOR);
    return {
      creatorXp,
      contributorXp,
      creatorRank: resolveReputationRank(creatorXp, rankThresholds),
      contributorRank: resolveReputationRank(contributorXp, rankThresholds),
      evidence: {
        publishedProjects,
        versionsCreated,
        postmarksSent,
        usefulFeedbacks,
        appliedSuggestions,
        recognizedContributions,
      },
    };
  }
}
