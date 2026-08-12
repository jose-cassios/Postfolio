export type UserType = 'USER' | 'MODERATOR' | 'ADMIN';

export interface ProfileUser {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  usertype: UserType;
}

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  pageLink: string | null;
  authorId: string;
}

export type ProjectCategory =
  | 'FULLSTACK'
  | 'FRONTEND'
  | 'BACKEND'
  | 'DESIGN'
  | 'MOBILE'
  | 'DATA_ANALYSIS'
  | 'OTHER';

export interface ProfileProject {
  id: string;
  name: string;
  description: string;
  category: ProjectCategory;
  githubLink: string | null;
  portfolioId: string;
}

export interface ProjectPayload {
  name: string;
  description: string;
  category: ProjectCategory;
  githublink: string | null;
}
