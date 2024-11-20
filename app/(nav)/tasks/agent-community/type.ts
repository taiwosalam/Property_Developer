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
  shareLink: string;
};

export interface CommentProps {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentProps[];
}
