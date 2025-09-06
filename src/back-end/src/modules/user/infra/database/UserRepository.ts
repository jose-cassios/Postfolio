// import PrismaUser from "@models/PrismaUser";
import User from "@user/domain/entities/User";
import { prisma } from "@infrastructure/config/Prisma";
import { InternalServerError } from "@shared/error/HttpError";
import { Prisma } from "@prisma/client";
import { UserMapper } from "@user/application/UserMapper";
import { IUserRepository } from "@user/domain/interfaces/IUserRepository";
import Email from "@user/domain/valueObject/Email";

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
}
