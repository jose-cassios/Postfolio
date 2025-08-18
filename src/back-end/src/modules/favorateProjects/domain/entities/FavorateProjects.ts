export class FavorateProjects {
  constructor(
    private id: string,
    private userId: string,
    private projectId: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getProjectId(): string {
    return this.projectId;
  }
}
