import { Container } from "inversify";
import { TYPES } from "@compositionRoot/Types";

import { IUserRepository } from "@user/domain/interfaces/IUserRepository";
import { IUserService } from "@user/domain/interfaces/IUserService";
import { UserPort } from "@user/domain/interfaces/UserPort";

import { UserRepository } from "@user/infra/database/UserRepository";
import { UserAdaper } from "@user/infra/UserAdapter";
import { UserService } from "@user/application/UserService";
import { UserController } from "@user/api/UserController";

export function userComposeModule(container: Container): void {
  container
    .bind<IUserRepository>(TYPES.IUserRepository)
    .to(UserRepository)
    .inRequestScope();
  container
    .bind<IUserService>(TYPES.IUserService)
    .to(UserService)
    .inRequestScope();
  container.bind<UserPort>(TYPES.UserPort).to(UserAdaper).inRequestScope();
  container
    .bind<UserController>(TYPES.UserController)
    .to(UserController)
    .inRequestScope();
}
