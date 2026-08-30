import {
  User as UserModel,
  UserType as UserTypeModel,
} from "@PrismaGen/client";
import { BadRequest } from "@shared/error/HttpError";
import User from "@user/domain/entities/User";
import { UserType } from "@user/domain/enum/UserType";
import Email from "@user/domain/valueObject/Email";

export const UserTypeMapper = {
  fromPrismaToDomain(userType: UserTypeModel | null): UserType {
    if (!userType) return UserType.USER;

    switch (userType) {
      case UserTypeModel.USER:
        return UserType.USER;
      case UserTypeModel.MODERATOR:
        return UserType.MODERATOR;
      case UserTypeModel.ADMIN:
        return UserType.ADMIN;
      default:
        throw new BadRequest("O tipo de user não existe!");
    }
  },
  fromDomainToPrisma(userType: UserType | null): UserTypeModel {
    if (!userType) return UserTypeModel.USER;

    switch (userType) {
      case UserType.USER:
        return UserTypeModel.USER;
      case UserType.MODERATOR:
        return UserTypeModel.MODERATOR;
      case UserType.ADMIN:
        return UserTypeModel.ADMIN;
      default:
        throw new BadRequest("O tipo de user não existe!");
    }
  },
  fromSchemaToDto(userType: string): UserType {
    switch (userType) {
      case "USER":
        return UserType.USER;
      case "MODERATOR":
        return UserType.MODERATOR;
      case "ADMIN":
        return UserType.ADMIN;
    }
    throw new BadRequest("O tipo de user não existe!");
  },
};

export const UserMapper = {
  fromPrismaToDomain(prismaUser: UserModel): User {
    return new User(
      prismaUser.id,
      prismaUser.username,
      new Email(prismaUser.email, false),
      prismaUser.password,
      prismaUser.bio,
      prismaUser.linkedin,
      prismaUser.github,
      prismaUser.website,
      UserTypeMapper.fromPrismaToDomain(prismaUser.userType),
      prismaUser.availableForHire,
      prismaUser.active
    );
  },
  fromDomaintoPrisma(user: User): UserModel {
    return {
      id: user.getId(),
      username: user.getUsername(),
      email: user.getEmail().getValue(),
      password: user.getPassword(),
      bio: user.getBio(),
      linkedin: user.getLinkedin(),
      github: user.getGithub(),
      website: user.getWebsite(),
      userType: UserTypeMapper.fromDomainToPrisma(user.getUserType()),
      availableForHire: user.isAvailableForHire(),
      active: user.isActive(),
    };
  },
};
