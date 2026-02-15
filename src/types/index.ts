// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ValidationError[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  bio?: string;
  role: "user" | "author" | "admin";
  created_at: string;
  updated_at: string;
}

// Lightweight user object returned by backend in embedded contexts (comments, notifications)
export interface UserSummary {
  id: string;
  username: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  bio?: string;
}

export interface UserProfile extends User {
  follower_count: number;
  following_count: number;
  article_count: number;
  is_following?: boolean;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

// Article Types
export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  reading_time_minutes: number;
  status: "draft" | "published" | "archived";
  author: User;
  categories?: Category[];
  tags: Tag[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  likes_count?: number;
  comments_count?: number;
  user_liked?: boolean;
  user_bookmarked?: boolean;
}

export interface ArticleCard {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  featured_image_url?: string;
  reading_time_minutes: number;
  author: {
    id: string;
    username: string;
    first_name?: string;
    last_name?: string;
    profile_image_url?: string;
  };
  categories?: {
    id: string;
    name: string;
    slug: string;
  }[];
  published_at?: string;
}

export interface CreateArticleData {
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featured_image_url?: string;
  category_ids?: string[];
  tag_ids?: string[];
  status: "draft" | "published";
}

export interface UpdateArticleData extends Partial<CreateArticleData> {
  id: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parent_id?: string;
  children?: Category[];
  color?: string;
}

// Tag Types
export interface Tag {
  id: string;
  name: string;
  slug: string;
  articles_count?: number;
}

// Search Types
export interface SearchParams {
  q: string;
  type?: "all" | "articles" | "categories" | "tags";
  page?: number;
  per_page?: number;
}

export interface SearchResults {
  articles?: ArticleCard[];
  categories?: Category[];
  tags?: Tag[];
}

// Engagement Types
export interface Comment {
  id: string;
  article_id: string;
  user: UserSummary;
  content: string;
  parent_id?: string;
  replies?: Comment[];
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateCommentData {
  content: string;
  parent_id?: string;
}

export interface LikeStatus {
  liked: boolean;
  likes_count: number;
}

export interface BookmarkStatus {
  bookmarked: boolean;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "article";
  message: string;
  actor: UserSummary;
  article?: { id: string; slug: string; title: string };
  read: boolean;
  created_at: string;
}

// Media Types
export interface Media {
  id: string;
  url: string;
  filename: string;
  alt_text?: string;
  mime_type: string;
  size: number;
  created_at: string;
}
