import User from "@user/domain/entities/User";
import Email from "@user/domain/valueObject/Email";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "@user/api/UserDTO";
import {
  ReputationAdjustmentInput,
  ReputationHistoryContract,
  ReputationRankConfigContract,
  ReputationReversalInput,
  UserAchievementContract,
  UserReputationContract,
} from "@shared/contracts/UserContracts";
import { UserType } from "@user/domain/enum/UserType";

export interface IUserService {
  create(userDto: CreateUserDTO): Promise<void>;
  updateById(dto: UpdateUserDTO): Promise<User>;
  deleteById(id: string): Promise<User | null>;

  login(loginDto: LoginUserDTO): Promise<string>;
  socialLogin(dto: CreateUserDTO): Promise<string>;

  findMany(): Promise<User[]>;
  findByEmail(email: Email): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  setActive(id: string, active: boolean): Promise<User>;
  setUserType(id: string, userType: UserType): Promise<User>;
  findAchievements(userId: string): Promise<UserAchievementContract[]>;
  findReputation(userId: string): Promise<UserReputationContract>;
  findReputationRankConfig(): Promise<ReputationRankConfigContract[]>;
  updateReputationRankConfig(config: ReputationRankConfigContract[]): Promise<ReputationRankConfigContract[]>;
  findReputationHistory(userId: string, limit?: number): Promise<ReputationHistoryContract>;
  applyReputationAdjustment(userId: string, adminId: string, input: ReputationAdjustmentInput): Promise<ReputationHistoryContract>;
  reverseReputationEvent(eventId: string, adminId: string, input: ReputationReversalInput): Promise<ReputationHistoryContract>;
}
