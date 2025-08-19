export class Comments {
  constructor(
    private id: string,
    private content: string,
    private userId: string,
    private projectId: string
  ) {}

  public getId(): string {
    return this.id;
  }

  public getConten(): string {
    return this.content;
  }

  public getUserId(): string {
    return this.userId;
  }

  public getProjectId(): string {
    return this.projectId;
  }
}
