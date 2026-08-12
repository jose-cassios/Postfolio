import { UserType } from "@user/domain/enum/UserType";

interface CreateUserDTO {
  username: string;
  email: string;
  password?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  userType: UserType;
}

export interface UpdateUserDTO {
  id: string;
  username?: string;
  email?: string;
  bio?: string;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
}

interface LoginUserDTO {
  email: string;
  password: string;
}

export { CreateUserDTO, LoginUserDTO };
