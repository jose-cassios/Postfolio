export interface PostMetricsPort {
  addPostmark(projectId: string): Promise<string>;
  removePostmark(projectId: string): Promise<string>;
  getTotalPostmarks(projectId: string): Promise<number>;
}
