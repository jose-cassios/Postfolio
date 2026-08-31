import { CreatePostMetricsDTO } from "@postMetrics/api/PostMetricsDTO";

export class PostMetrics {
  constructor(
    private id: string,
    private postmarkCount: number,
    private projectId: string
  ) {}

  public static create(dto: CreatePostMetricsDTO): PostMetrics {
    return new PostMetrics("", 0, dto.projectId);
  }

  public incrementPostmarkCount() {
    this.postmarkCount += 1;
  }

  public decrementPostmarkCount() {
    this.postmarkCount -= 1;
  }

  public getId(): string {
    return this.id;
  }

  public getPostmarkCount(): number {
    return this.postmarkCount;
  }

  public getProjectId(): string {
    return this.projectId;
  }
}
