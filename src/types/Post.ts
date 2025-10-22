export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  tags?: string[];
  category?: string;
  author?: {
    name?: string;
    email?: string;
  };
  views?: number;
  likes?: number;
  readTime?: number;
  status: string;
  createdAt: Date;
}
