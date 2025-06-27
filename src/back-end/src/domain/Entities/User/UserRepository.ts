import User from "@domain/entities/user/User";
import Email from "@domain/valueObject/Email";

export interface UserRepository {
  insert: (user: User) => Promise<User | null>;
  findMany: () => Promise<User[]>;
  findById: (id: string) => Promise<User | null>;
  findByEmail: (email: Email) => Promise<User | null>;
  deleteById: (id: string) => Promise<User | null>;
}
