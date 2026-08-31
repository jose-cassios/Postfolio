import { Project } from "./project";
import type { ProjectAppreciation, ProjectVersion } from "../services/project.service";

export interface ProjectDetails extends Project {
  coverImageUrl: string | null;
  description: string;
  gallery: string[];
  appreciates: number;
  saves: number;
  tags: string[];
  publicFeedback?: Array<{ id: string; content: string; username: string }>;
  publishedAt: string | null;
  feedbackAspects: string[];
  feedbackQuestion: string | null;
  seekingFeedback: boolean;
  currentVersion: number;
  appreciations: ProjectAppreciation[];
  versions: ProjectVersion[];
}
