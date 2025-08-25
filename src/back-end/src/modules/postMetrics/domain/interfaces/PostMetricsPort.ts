export interface PostMetricsPort {
  addAppreciate(projectId: string): Promise<string>;
  removeAppreciate(projectId: string): Promise<string>;
}
