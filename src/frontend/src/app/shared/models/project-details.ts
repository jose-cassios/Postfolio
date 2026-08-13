import { Project } from "./project";

export interface ProjectDetails extends Project {
  publishedAt: string|number|Date;
  coverImageUrl: string | null;
  description: string;
  gallery: string[];
  appreciates: number;
  saves: number;
  tags: string[];
  publicFeedback?: Array<{ id: string; content: string; username: string }>;
}
