import User from "@user/domain/entities/User";
import { Crypt } from "@shared/util/Crypto";
import {
  BadRequest,
  Conflict,
  InternalServerError,
  NotFound,
  Unauthorized,
} from "@shared/error/HttpError";
import { Token } from "@shared/util/Token";
import { IUserRepository } from "@user/domain/interfaces/IUserRepository";
import Email from "@user/domain/valueObject/Email";
import {
  CreateUserDTO,
  LoginUserDTO,
  SocialLoginDTO,
  UpdateUserDTO,
} from "@user/api/UserDTO";
import { IUserService } from "@user/domain/interfaces/IUserService";
import { inject, injectable } from "inversify";
import { TYPES } from "@compositionRoot/Types";
import { UserMapper } from "@user/application/UserMapper";
import { UserCreatedEvent } from "@shared/event/UserCreatedEvent";
import { EventListener } from "@shared/event/EventListener";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.IUserRepository)
    private userRepository: IUserRepository
  ) {}
  async create(userDto: CreateUserDTO): Promise<void> {
    const hashedPassword = await Crypt.hashPassWord(userDto.password);
    const userDomain = UserMapper.fromCreateUserDTOtoDomain(
      userDto,
      hashedPassword
    );

    const existingUser = await this.userRepository.findByEmail(
      userDomain.email
    );

    if (existingUser) throw new Conflict("Por favor, use outro email!");

    const user = await this.userRepository.create(userDomain);

    if (!user)
      throw new InternalServerError("Não foi possivel salver o usuario");

    const event = new UserCreatedEvent(
      user.id,
      user.username,
      user.email.getValue()
    );
    EventListener.publish(event);
    console.log("Portfolio criado com sucesso");
  }

  async updateById(dto: UpdateUserDTO): Promise<User> {
    const user = await this.userRepository.findById(dto.id);

    if (!user) throw new NotFound("Usuario não encontrado");

    if (dto.email !== undefined) {
      const exist = await this.userRepository.findByEmail(
        new Email(dto.email, false)
      );

      if (exist) throw new Conflict("O novo email já está cadastrado.");
    }
    await user.update(dto);

    return await this.userRepository.updateById(user);
  }

  async deleteById(id: string): Promise<User | null> {
    return await this.userRepository.deleteById(id);
  }

  async login(loginDto: LoginUserDTO): Promise<string> {
    const email = new Email(loginDto.email);

    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new NotFound("Usuário não encontrado!");

    const checkPassWord = await user.comparePassword(loginDto.password);

    if (!checkPassWord) throw new Unauthorized("Credenciais inválidas");

    return Token.generate(user.id, user.email.getValue());
  }

  async socialLogin(socialLoginDto: SocialLoginDTO): Promise<string> {
    const email = new Email(socialLoginDto.email);
    let user = await this.findByEmail(email);

    if (!user) {
      user = await this.userRepository.create(
        UserMapper.fromSocialLoginDTOtoDomain(socialLoginDto)
      );
      const event = new UserCreatedEvent(
        user.id,
        user.username,
        user.email.getValue()
      );
      await EventListener.publish(event);
    }

    return Token.generate(user.id, user.email.getValue());
  }

  async findMany(): Promise<User[]> {
    return this.userRepository.findMany();
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }
}
