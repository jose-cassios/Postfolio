import { CreatePostMetricsDTO } from "@postMetrics/api/PostMetricsDTO";

export class PostMetrics {
  constructor(
    private id: string,
    private appreciateCount: number,
    private projectId: string
  ) {}

  public static create(dto: CreatePostMetricsDTO): PostMetrics {
    return new PostMetrics("", 0, dto.projectId);
  }

  public incrementsAppreciateCount() {
    this.appreciateCount += 1;
  }

  public decrementAppreciateCount() {
    this.appreciateCount -= 1;
  }

  public getId(): string {
    return this.id;
  }

  public getCauntAppreciate(): number {
    return this.appreciateCount;
  }

  public getProjectId(): string {
    return this.projectId;
  }
}
