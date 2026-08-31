import User from "@user/domain/entities/User";
import { Conflict, NotFound, Unauthorized } from "@shared/error/HttpError";
import { Token } from "@shared/util/Token";
import { IUserRepository } from "@user/domain/interfaces/IUserRepository";
import Email from "@user/domain/valueObject/Email";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "@user/api/UserDTO";
import { IUserService } from "@user/domain/interfaces/IUserService";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";
import { UserCreatedEvent } from "@shared/event/UserCreatedEvent";
import { EventListener } from "@shared/event/EventListener";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private repository: IUserRepository
  ) {}
  async create(dto: CreateUserDTO): Promise<void> {
    const user = await User.create(dto);
    const exist = await this.repository.findByEmail(user.getEmail());

    if (exist) throw new Conflict("Por favor, use outro email!");

    const usernameInUse = await this.repository.findByUsername(
      user.getUsername()
    );
    if (usernameInUse) throw new Conflict("Este nome de usuario ja esta em uso.");

    const createdUser = await this.repository.create(user);

    const event = new UserCreatedEvent(
      createdUser.getId(),
      createdUser.getUsername(),
      createdUser.getEmail().getValue()
    );

    EventListener.publish(event);
  }

  async updateById(dto: UpdateUserDTO): Promise<User> {
    const user = await this.repository.findById(dto.id);

    if (!user) throw new NotFound("Usuario não encontrado");

    if (
      dto.email !== undefined &&
      dto.email.toLowerCase() !== user.getEmail().getValue().toLowerCase()
    ) {
      const exist = await this.repository.findByEmail(
        new Email(dto.email, false)
      );

      if (exist) throw new Conflict("O email já está cadastrado.");
    }
    if (
      dto.username !== undefined &&
      dto.username.toLowerCase() !== user.getUsername().toLowerCase()
    ) {
      const exist = await this.repository.findByUsername(dto.username);
      if (exist) throw new Conflict("Este nome de usuario ja esta em uso.");
    }

    await user.update(dto);

    return await this.repository.updateById(user);
  }

  async deleteById(id: string): Promise<User | null> {
    return await this.repository.deleteById(id);
  }

  async login(loginDto: LoginUserDTO): Promise<string> {
    const email = new Email(loginDto.email);

    const user = await this.repository.findByEmail(email);

    if (!user) throw new NotFound("Usuário não encontrado!");
    if (!user.isActive()) throw new Unauthorized("Esta conta esta suspensa.");

    const checkPassWord = await user.comparePassword(loginDto.password);

    if (!checkPassWord) throw new Unauthorized("Credenciais inválidas");

    return Token.generate(user.getId(), user.getEmail().getValue());
  }

  async socialLogin(dto: CreateUserDTO): Promise<string> {
    const user = await User.create(dto);

    const exist = await this.findByEmail(user.getEmail());

    if (exist) {
      if (!exist.isActive()) throw new Unauthorized("Esta conta esta suspensa.");
      return Token.generate(exist.getId(), exist.getEmail().getValue());
    }

    const createdUser = await this.repository.create(user);

    const event = new UserCreatedEvent(
      createdUser.getId(),
      createdUser.getUsername(),
      createdUser.getEmail().getValue()
    );

    EventListener.publish(event);

    return Token.generate(
      createdUser.getId(),
      createdUser.getEmail().getValue()
    );
  }

  async findMany(): Promise<User[]> {
    return this.repository.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findById(id);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.repository.findByEmail(email);
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.repository.findByUsername(username);
  }

  async setActive(id: string, active: boolean): Promise<User> {
    const user = await this.repository.findById(id);
    if (!user) throw new NotFound("Usuario nao encontrado.");
    user.setActive(active);
    return await this.repository.updateById(user);
  }

  async findAchievements(userId: string) {
    return await this.repository.findAchievements(userId);
  }

  async findReputation(userId: string) {
    return await this.repository.findReputation(userId);
  }
}
