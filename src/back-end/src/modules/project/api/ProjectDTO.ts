import { ProjectCategory } from "@project/domain/enum/ProjectCategory";
import { ProjectBlock, ProjectStatus } from "@project/domain/valueObject/ProjectContent";

interface CreateProjectDTO {
  name: string;
  description: string;
  category: ProjectCategory;
  githublink?: string | null;
  externalLink?: string | null;
  coverImageUrl?: string | null;
  galleryUrls?: string[];
  tools?: string[];
  tags?: string[];
  contentBlocks?: ProjectBlock[];
  status?: ProjectStatus;
  feedbackAspects?: string[];
  feedbackQuestion?: string | null;
  portfolioId: string;
}

interface UpdateProjectDTO {
  id: string;
  name?: string;
  description?: string;
  category?: ProjectCategory;
  githublink?: string | null;
  externalLink?: string | null;
  coverImageUrl?: string | null;
  galleryUrls?: string[];
  tools?: string[];
  tags?: string[];
  contentBlocks?: ProjectBlock[];
  status?: ProjectStatus;
  feedbackAspects?: string[];
  feedbackQuestion?: string | null;
  changelog?: string;
  postmarkIds?: string[];
}

export interface ProjectListQuery {
  q?: string;
  category?: ProjectCategory;
  tool?: string;
  tag?: string;
  sort: "newest" | "likes";
  page: number;
  limit: number;
}

export { CreateProjectDTO, UpdateProjectDTO };
