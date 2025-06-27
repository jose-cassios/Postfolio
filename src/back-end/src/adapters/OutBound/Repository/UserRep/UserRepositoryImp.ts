import User from "@domain/entities/user/User";
import PrismaUser from "@models/PrismaUser";
import { UserRepository } from "@domain/entities/user/UserRepository";
import prismaUserRepository, {
  PrismaUserRepository,
} from "@repository/userRep/PrismaUserRepository";
import Mapper from "@util/Mapper";
import Email from "@domain/valueObject/Email";

export class UserRepositoryImp implements UserRepository {
  constructor(private readonly prismaUserRepository: PrismaUserRepository) {}

  async insert(user: User): Promise<User | null> {
    const userEntity: PrismaUser = Mapper.User.toPrisma(user);
    return Mapper.User.toDomain(
      await this.prismaUserRepository.insert(userEntity)
    );
  }

  async findMany(): Promise<User[]> {
    const usersEntity = await this.prismaUserRepository.findMany();

    const users = usersEntity.map(Mapper.User.toDomain);

    return users;
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.prismaUserRepository.findById(id);
    if (!userEntity) return null;
    return Mapper.User.toDomain(userEntity);
  }
  async findByEmail(email: Email): Promise<User | null> {
    const userEntity = await this.prismaUserRepository.findByEmail(
      email.getValue()
    );
    if (!userEntity) return null;
    return Mapper.User.toDomain(userEntity);
  }
  async deleteById(id: string): Promise<User | null> {
    const userEntity = await this.prismaUserRepository.deleteById(id);
    if (!userEntity) return null;
    return Mapper.User.toDomain(userEntity);
  }
}
const userRepositoryImp = new UserRepositoryImp(prismaUserRepository);
export default userRepositoryImp;

// const userRepository: UserRepository = new UserRepositoryImp();
// export default userRepository;
