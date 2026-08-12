import { ProjectCategory } from "@project/domain/enum/ProjectCategory";

interface CreateProjectDTO {
  name: string;
  description: string;
  category: ProjectCategory;
  githublink?: string | null;
  portfolioId: string;
}

interface UpdateProjectDTO {
  id: string;
  name?: string;
  description?: string;
  category?: ProjectCategory;
  githublink?: string | null;
}

export { CreateProjectDTO, UpdateProjectDTO };
