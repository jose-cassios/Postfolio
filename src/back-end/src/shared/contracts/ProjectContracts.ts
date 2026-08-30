export interface ProjectContract {
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
  createdAt: Date;
  updatedAt: Date;
  portfolioId: string;
  author?: {
    id: string;
    username: string;
    bio: string;
    availableForHire: boolean;
  };
  metrics?: {
    likes: number;
    appreciates: number;
    comments: number;
    saves: number;
  };
  publicFeedback?: Array<{
    id: string;
    content: string;
    username: string;
  }>;
}

export interface PaginatedProjectsContract {
  data: ProjectContract[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ProjectContactContract {
  username: string;
  email: string;
  linkedin: string | null;
  github: string | null;
  website: string | null;
}

export interface ProjectInteractionContract {
  liked: boolean;
  appreciated: boolean;
  saved: boolean;
  likes: number;
  appreciates: number;
}

export interface ProjectFeedbackContract {
  id: string;
  content: string;
  username: string;
}
