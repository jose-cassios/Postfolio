import { CommentsMapper } from "@comments/application/CommentsMapper";
import { Comments } from "@comments/domain/entities/Comments";
import { ICommentsRepository } from "@comments/domain/interfaces/ICommentsRepository";
import { prisma } from "@infrastructure/config/prisma";
import { Prisma } from "@prisma/client";
import { InternalServerError } from "@shared/error/HttpError";
import { Comments as CommentsModel } from "@prisma/client";

export class CommentsRepository implements ICommentsRepository {
  async create(comment: Comments): Promise<Comments> {
    try {
      const model = await prisma.comments.create({
        data: {
          ...CommentsMapper.fromDomainToPrisma(comment),
          id: undefined,
        },
      });

      return CommentsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel criar o comentario! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao criar o comentario!");
    }
  }

  async update(comment: Comments): Promise<Comments> {
    try {
      const model = await prisma.comments.update({
        where: {
          id: comment.getId(),
        },
        data: {
          ...CommentsMapper.fromDomainToPrisma(comment),
        },
      });

      return CommentsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel atualizar o comentario! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao atualizar o comentario!");
    }
  }

  async delete(comment: Comments): Promise<Comments> {
    try {
      const model = await prisma.comments.delete({
        where: {
          id: comment.getId(),
        },
      });

      return CommentsMapper.fromPrismaToDomain(model);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel deletar o comentario! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao deletar o comentario!");
    }
  }

  async findById(id: string): Promise<Comments | null> {
    try {
      const model = await prisma.comments.findUnique({
        where: {
          id,
        },
      });

      return model ? CommentsMapper.fromPrismaToDomain(model) : null;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel buscar o comentario! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao buscar o comentario!");
    }
  }

  async findProjectIdCursor(
    projectId: string,
    limit: number,
    date: Date | null
  ): Promise<Comments[]> {
    try {
      const models = await this.findProjectIdCursorQuery(
        projectId,
        limit,
        date
      );

      return models.map(CommentsMapper.fromPrismaToDomain);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerError(
          `Não foi possivel buscar os comentario! Código: ${error.code}`
        );
      }
      throw new InternalServerError("Erro ao buscar os comentario!");
    }
  }

  private async findProjectIdCursorQuery(
    projectId: string,
    limit: number,
    date: Date | null
  ): Promise<CommentsModel[]> {
    if (date) {
      return await prisma.comments.findMany({
        take: limit,
        skip: 1,
        where: {
          projectId,
        },
        cursor: {
          projectId_created_at: {
            projectId,
            created_at: date,
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });
    }

    return await prisma.comments.findMany({
      take: limit,
      where: {
        projectId,
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }
}
