export type ProjectStatus = 'DRAFT' | 'PUBLISHED';
export type ProjectTextVariant = 'TITLE' | 'HEADING' | 'BODY' | 'QUOTE';
export type ProjectBlockAlignment = 'LEFT' | 'CENTER' | 'RIGHT';
export type ProjectMediaWidth = 'STANDARD' | 'WIDE' | 'FULL';

export interface ProjectTextBlock {
  id: string;
  type: 'TEXT';
  content: string;
  variant: ProjectTextVariant;
  alignment: ProjectBlockAlignment;
  bold: boolean;
  italic: boolean;
}

export interface ProjectImageBlock {
  id: string;
  type: 'IMAGE';
  url: string;
  alt: string;
  caption: string;
  width: ProjectMediaWidth;
}

export interface ProjectVideoBlock {
  id: string;
  type: 'VIDEO';
  url: string;
  posterUrl: string | null;
  caption: string;
  width: ProjectMediaWidth;
}

export interface ProjectCarouselBlock {
  id: string;
  type: 'CAROUSEL';
  items: Array<{ url: string; alt: string }>;
  caption: string;
  width: ProjectMediaWidth;
}

export type ProjectBlock =
  | ProjectTextBlock
  | ProjectImageBlock
  | ProjectVideoBlock
  | ProjectCarouselBlock;

export interface ProjectDocument {
  id: string;
  name: string;
  description: string;
  category: string;
  githubLink: string | null;
  externalLink: string | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
  tools: string[];
  tags: string[];
  contentBlocks: ProjectBlock[];
  contentMarkdown: string;
  status: ProjectStatus;
  feedbackAspects: string[];
  feedbackQuestion: string | null;
  seekingFeedback: boolean;
  currentVersion: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  portfolioId: string;
}

export interface ProjectEditorPayload {
  name: string;
  description: string;
  category: string;
  githublink: string | null;
  externalLink: string | null;
  coverImageUrl: string | null;
  galleryUrls: string[];
  tools: string[];
  tags: string[];
  contentBlocks: ProjectBlock[];
  status: ProjectStatus;
  feedbackAspects: string[];
  feedbackQuestion: string | null;
  seekingFeedback: boolean;
  changelog?: string;
  appreciationIds?: string[];
}
