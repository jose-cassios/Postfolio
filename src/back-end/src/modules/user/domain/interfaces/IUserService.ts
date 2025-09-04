import User from "@user/domain/entities/User";
import Email from "@user/domain/valueObject/Email";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "@user/api/UserDTO";

export interface IUserService {
  create(userDto: CreateUserDTO): Promise<void>;
  updateById(dto: UpdateUserDTO): Promise<User>;
  deleteById(id: string): Promise<User | null>;

  login(loginDto: LoginUserDTO): Promise<string>;
  socialLogin(dto: CreateUserDTO): Promise<string>;

  findMany(): Promise<User[]>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
}
