import { User as UserModel, UserType as UserTypeModel } from "@prisma/client";
import { BadRequest } from "@shared/error/HttpError";
import { CreateUserDTO, UpdateUserDTO } from "@user/api/UserDTO";
import User from "@user/domain/entities/User";
import { UserType } from "@user/domain/enum/UserType";
import Email from "@user/domain/valueObject/Email";

export const UserTypeMapper = {
  fromPrismaToDomain(userType: UserTypeModel): UserType {
    switch (userType) {
      case UserTypeModel.DEVELOPER:
        return UserType.DEVELOPER;
      case UserTypeModel.EMPLOYER:
        return UserType.EMPLOYER;
    }
  },
  fromDomainToPrisma(userType: UserType): UserTypeModel {
    switch (userType) {
      case UserType.DEVELOPER:
        return UserTypeModel.DEVELOPER;
      case UserType.EMPLOYER:
        return UserTypeModel.EMPLOYER;
    }
  },
  fromSchemaToDto(userType: string): UserType {
    switch (userType) {
      case "DEVELOPER":
        return UserType.DEVELOPER;
      case "EMPLOYER":
        return UserType.EMPLOYER;
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
      UserTypeMapper.fromPrismaToDomain(prismaUser.userType)
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
    };
  },
};
