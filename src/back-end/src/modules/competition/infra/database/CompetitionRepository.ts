import { InternalServerError } from "@shared/error/HttpError";
import { prisma } from "@infrastructure/config/Prisma";
import { Prisma } from "@PrismaGen/client";
import { Competition } from "@competition/domain/entities/Competition";
import { CompetitionMapper } from "@competition/application/CompetitionMapper";
import { ICompetitionRepository } from "@competition/domain/interfaces/ICompetitionRepository";
import { CompetitionContract } from "@competition/api/CompetitionDTO";
import { Conflict, NotFound } from "@shared/error/HttpError";
Competition;

export class PrismaCompetitionRepository implements ICompetitionRepository {
  async create(competition: Competition): Promise<Competition> {
    try {
      const model = await prisma.competition.create({
        data: {
          ...CompetitionMapper.fromDomainToPrisma(competition),
          id: undefined,
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

  async vote(competitionId: string, projectId: string, userId: string): Promise<void> {
    try {
      await prisma.$transaction(async (tx) => {
        const details = await tx.projectCompDetails.findUniqueOrThrow({
          where: { competitionId_projectId: { competitionId, projectId } },
        });
        await tx.rating.create({
          data: {
            score: 1,
            userId,
            projectId,
            competitionId,
            projectCompDetailsID: details.id,
          },
        });
        await tx.projectCompDetails.update({
          where: { id: details.id },
          data: { totalReviewers: { increment: 1 }, totalScore: { increment: 1 } },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") throw new Conflict("Voce ja votou nesta competicao.");
        if (error.code === "P2025") throw new NotFound("Projeto inscrito nao encontrado.");
      }
      throw error;
    }
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
        include: {
          project: {
            include: {
              portfolio: { include: { author: { select: { id: true, username: true } } } },
            },
          },
        },
      },
    } satisfies Prisma.CompetitionInclude;
  }

  private toContract(model: any): CompetitionContract {
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
    const ordered = [...model.worksDetails].sort((a, b) => b.totalReviewers - a.totalReviewers);
    let previousVotes: number | null = null;
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
      submissions: ordered.map((details, index) => {
        if (details.totalReviewers !== previousVotes) currentRank = index + 1;
        previousVotes = details.totalReviewers;
        return {
          id: details.project.id,
          name: details.project.name,
          coverImageUrl: details.project.coverImageUrl,
          tools: details.project.tools,
          author: details.project.portfolio.author,
          ...(resultsVisible
            ? {
                votes: details.totalReviewers,
                rank: details.totalReviewers > 0 && currentRank <= 3
                  ? currentRank
                  : undefined,
              }
            : {}),
        };
      }),
    };
  }
}
