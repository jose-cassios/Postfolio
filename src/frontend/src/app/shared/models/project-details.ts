import { Project } from "./project";

export interface ProjectDetails extends Project {
  coverImageUrl: string | null;
  description: string;
  gallery: string[];
  appreciates: number;
  saves: number;
  tags: string[];
  publicFeedback?: Array<{ id: string; content: string; username: string }>;
  publishedAt: string | null;
}
