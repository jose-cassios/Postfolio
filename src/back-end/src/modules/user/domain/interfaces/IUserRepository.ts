import User from "@user/domain/entities/User";
import Email from "@user/domain/valueObject/Email";
import {
  ReputationAdjustmentInput,
  ReputationHistoryContract,
  ReputationRankConfigContract,
  ReputationReversalInput,
  UserAchievementContract,
  UserReputationContract,
} from "@shared/contracts/UserContracts";

export interface IUserRepository {
  create(user: User): Promise<User>;
  updateById(user: User): Promise<User>;
  deleteById(id: string): Promise<User | null>;

  findMany(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findAchievements(userId: string): Promise<UserAchievementContract[]>;
  findReputation(userId: string): Promise<UserReputationContract>;
  findReputationRankConfig(): Promise<ReputationRankConfigContract[]>;
  updateReputationRankConfig(config: ReputationRankConfigContract[]): Promise<ReputationRankConfigContract[]>;
  findReputationHistory(userId: string, limit: number): Promise<ReputationHistoryContract>;
  applyReputationAdjustment(userId: string, adminId: string, input: ReputationAdjustmentInput): Promise<ReputationHistoryContract>;
  reverseReputationEvent(eventId: string, adminId: string, input: ReputationReversalInput): Promise<ReputationHistoryContract>;
}
