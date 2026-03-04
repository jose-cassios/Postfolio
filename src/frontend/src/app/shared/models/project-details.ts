import { Project } from "./project";

export interface ProjectDetails extends Project {
publishedAt: string|number|Date;
  coverImageUrl: string;
  description: string;
  gallery: string[];
  appreciates: number;
  saves: number;
  tags: string[];
}
