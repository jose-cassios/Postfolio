import { ProjectCategory } from "@project/domain/enum/ProjectCategory";

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
}

export interface ProjectListQuery {
  q?: string;
  category?: ProjectCategory;
  tool?: string;
  tag?: string;
  sort: "newest" | "likes" | "appreciates";
  page: number;
  limit: number;
}

export { CreateProjectDTO, UpdateProjectDTO };
