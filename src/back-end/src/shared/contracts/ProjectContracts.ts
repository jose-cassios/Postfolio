import { ProjectBlock, ProjectStatus } from "@project/domain/valueObject/ProjectContent";

export interface ProjectContract {
  id: string;
  name: string;
  description: string;
  category: string;
  githubLink: string | null;
  externalLink: string | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
  tools: string[];
  tags: string[];
  contentBlocks: ProjectBlock[];
  contentMarkdown: string;
  status: ProjectStatus;
  feedbackAspects: string[];
  feedbackQuestion: string | null;
  currentVersion: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  portfolioId: string;
  author?: {
    id: string;
    username: string;
    bio: string;
    profilePhoto: string | null;
    availableForHire: boolean;
  };
  metrics?: {
    likes: number;
    postmarks: number;
    comments: number;
    saves: number;
  };
  publicFeedback?: Array<{
    id: string;
    content: string;
    username: string;
  }>;
  postmarks?: ProjectPostmarkContract[];
  versions?: ProjectVersionContract[];
}

export interface PaginatedProjectsContract {
  data: ProjectContract[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ProjectContactContract {
  username: string;
  email: string;
  linkedin: string | null;
  github: string | null;
  website: string | null;
}

export interface ProjectInteractionContract {
  liked: boolean;
  postmarked: boolean;
  saved: boolean;
  likes: number;
  postmarks: number;
}

export type PostmarkStatus = "PENDING" | "USEFUL" | "APPLIED" | "DISMISSED";

export interface ProjectPostmarkContract {
  id: string;
  aspect: string;
  strength: string;
  suggestion: string;
  additionalComment: string | null;
  status: PostmarkStatus;
  createdAt: Date;
  updatedAt: Date;
  creditedInVersion: number | null;
  author: { id: string; username: string; profilePhoto: string | null };
}

export interface ProjectVersionContract {
  id: string;
  versionNumber: number;
  changelog: string;
  contentMarkdown: string;
  createdAt: Date;
  author: { id: string; username: string };
  credits: Array<{
    postmarkId: string;
    aspect: string;
    contributor: { id: string; username: string };
  }>;
}

export interface ProjectFeedbackContract {
  id: string;
  content: string;
  username: string;
}
