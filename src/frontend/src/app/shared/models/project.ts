export interface Project {
  id: string;
  title: string;
  slug?: string;
  imageUrl: string;

  likes: number;
  views: number;
  commentsCount: number;
  createdAt: Date;

  author?: {
    name: string;
    avatar?: string;
    username?: string;
    bio?: string;
  };
  technologies?: string[];
  category?: string;
}
