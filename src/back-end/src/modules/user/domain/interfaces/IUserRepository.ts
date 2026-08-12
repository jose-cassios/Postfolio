import User from "@user/domain/entities/User";
import Email from "@user/domain/valueObject/Email";

export interface IUserRepository {
  create(user: User): Promise<User>;
  updateById(user: User): Promise<User>;
  deleteById(id: string): Promise<User | null>;

  findMany(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
}
