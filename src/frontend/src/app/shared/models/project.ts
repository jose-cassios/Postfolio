export interface Project {
  id: string;
  title: string;
  slug?: string;
  imageUrl: string;
  likes: number;
  views: number;
  author?: {
    name: string;
    avatar?: string;
    username?: string;
  };
  technologies?: string[];
  commentsCount?: number;
  category?: string;
}
