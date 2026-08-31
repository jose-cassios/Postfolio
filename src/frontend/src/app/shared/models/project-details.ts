import { Project } from "./project";
import type { ProjectPostmark, ProjectVersion } from "../services/project.service";

export interface ProjectDetails extends Project {
  coverImageUrl: string | null;
  description: string;
  gallery: string[];
  postmarksCount: number;
  saves: number;
  tags: string[];
  publicFeedback?: Array<{ id: string; content: string; username: string }>;
  publishedAt: string | null;
  feedbackAspects: string[];
  feedbackQuestion: string | null;
  currentVersion: number;
  postmarks: ProjectPostmark[];
  versions: ProjectVersion[];
}
