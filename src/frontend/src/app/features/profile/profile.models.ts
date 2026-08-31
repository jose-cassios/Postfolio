import { ProjectBlock, ProjectStatus } from '../../shared/models/project-content';

export type UserType = 'USER' | 'MODERATOR' | 'ADMIN';

export interface ProfileUser {
  id: string;
  username: string;
  email?: string;
  bio?: string;
  linkedin?: string | null;
  github?: string | null;
  website?: string | null;
  profilePhoto?: string | null;
  coverPhoto?: string | null;
  availableForHire?: boolean;
  achievements?: Array<{ competitionId: string; competitionName: string; rank: number }>;
  reputation?: UserReputation;
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
  externalLink: string | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
  tools: string[];
  tags: string[];
  contentBlocks: ProjectBlock[];
  contentMarkdown: string;
  status: ProjectStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  portfolioId: string;
}

export interface UserReputation {
  creator: ReputationRankProgress;
  contributor: ReputationRankProgress;
  evidence: {
    publishedProjects: number;
    versionsCreated: number;
    postmarksSent: number;
    usefulFeedbacks: number;
    appliedSuggestions: number;
    recognizedContributions: number;
  };
}

export interface ReputationRankProgress {
  rank: ReputationRank;
  xp: number;
  nextRank: ReputationRank | null;
  xpRequired: number | null;
  xpRemaining: number;
  progressPercent: number;
  mission: string | null;
  missionCurrentValue: number | null;
  missionRequiredValue: number | null;
  missionCompleted: boolean;
}

export type ReputationRank =
  | 'F'
  | 'F+'
  | 'E'
  | 'E+'
  | 'D'
  | 'D+'
  | 'C'
  | 'C+'
  | 'B'
  | 'B+'
  | 'A'
  | 'A+'
  | 'S'
  | 'SS';
