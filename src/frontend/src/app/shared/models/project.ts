import { ProjectBlock, ProjectStatus } from './project-content';

export interface Project {
  id: string;
  title: string;
  slug?: string;
  imageUrl: string | null;

  likes: number;
  views: number;
  commentsCount: number;
  appreciates?: number;
  saves?: number;
  createdAt: Date;

  author?: {
    name: string;
    avatar?: string;
    username?: string;
    bio?: string;
    availableForHire?: boolean;
  };
  technologies?: string[];
  tags?: string[];
  category?: string;
  description?: string;
  gallery?: string[];
  githubLink?: string | null;
  externalLink?: string | null;
  contentBlocks?: ProjectBlock[];
  contentMarkdown?: string;
  status?: ProjectStatus;
  publishedAt?: string | null;
}
