import { UpdateProjectDTO } from "@project/api/ProjectDTO";
import { ProjectCategory } from "@project/domain/enum/ProjectCategory";

export class Project {
  constructor(
    private id: string,
    private name: string,
    private description: string,
    private category: ProjectCategory,
    private portfolioId: string,
    private githubLink: string | null = null,
    private externalLink: string | null = null,
    private coverImageUrl: string | null = null,
    private galleryUrls: string[] = [],
    private tools: string[] = [],
    private tags: string[] = [],
    private createdAt: Date = new Date(),
    private updatedAt: Date = new Date()
  ) {}

  // Atualização seletiva
  public update(dto: UpdateProjectDTO) {
    if (dto.name !== undefined) {
      this.name = dto.name;
    }

    if (dto.description !== undefined) {
      this.description = dto.description;
    }

    if (dto.category !== undefined) {
      this.category = dto.category;
    }

    if (dto.githublink !== undefined) {
      this.githubLink = dto.githublink;
    }

    if (dto.externalLink !== undefined) this.externalLink = dto.externalLink;
    if (dto.coverImageUrl !== undefined) this.coverImageUrl = dto.coverImageUrl;
    if (dto.galleryUrls !== undefined) this.galleryUrls = dto.galleryUrls;
    if (dto.tools !== undefined) this.tools = dto.tools;
    if (dto.tags !== undefined) this.tags = dto.tags;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getDescription(): string {
    return this.description;
  }

  public getCategory(): ProjectCategory {
    return this.category;
  }

  public getPortfolioId(): string {
    return this.portfolioId;
  }

  public getGithubLink(): string | null {
    return this.githubLink;
  }

  public getExternalLink(): string | null { return this.externalLink; }
  public getCoverImageUrl(): string | null { return this.coverImageUrl; }
  public getGalleryUrls(): string[] { return this.galleryUrls; }
  public getTools(): string[] { return this.tools; }
  public getTags(): string[] { return this.tags; }
  public getCreatedAt(): Date { return this.createdAt; }
  public getUpdatedAt(): Date { return this.updatedAt; }
}
