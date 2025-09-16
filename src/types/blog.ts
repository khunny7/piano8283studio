export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  authorEmail: string;
  authorPhoto?: string;
  published?: string; // Only set when published
  createdAt?: any;
  updatedAt?: any;
  tags: string[];
  isPrivate: boolean;
  isDraft: boolean; // New field for draft functionality
  featuredImage?: string;
}

export interface Comment {
  id?: string;
  postId: string;
  content: string;
  author: string;
  authorEmail: string;
  authorPhoto?: string;
  createdAt?: any;
  updatedAt?: any;
  isModerated?: boolean; // For admin moderation
  replies?: Comment[]; // For nested comments (future feature)
}