export type ThreadCardProps = {
  picture_url: string;
  user_pics: string;
  name: string;
  role: string;
  time: string;
  title: string;
  desc: string;
  myArticle?: boolean;
  id: string | number;
  comments: string;
  slug: string;
  likes: string;
  dislikes: string;
  video: string;
  shareLink: string;
  setIsLikeDislikeLoading?: (value: boolean) => void; 
  published?: boolean;
};

export interface CommentProps {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentProps[];
}

export interface ArticlesRequestParams{
  search?: string;
  sort?: 'asc' | 'desc'
  page?: number;
  all?: boolean;
  recent?: boolean;
  state?: string;
  trending?: boolean;
  start_date?: string;
  end_date?: string;
}

export interface PropertyRequestParams{
    search?: string;
    sort?: 'asc' | 'desc'
    page?: number;
    all?: boolean;
    recent?: boolean;
    state?: string;
    trending?: boolean;
    start_date?: string;
    current_month?: boolean;
    end_date?: string;
}