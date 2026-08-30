export interface UserPort {
  exist(userId: string): Promise<boolean>;
  isAdmin(userId: string): Promise<boolean>;
}
