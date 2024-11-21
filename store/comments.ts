import { CommentProps } from "@/components/tasks/announcements/comment";
import create from "zustand";

interface ArticleState {
  post: any | null;
  comments: CommentProps[];
  setPost: (post: any) => void;
  setComments: (comments: CommentProps[]) => void;
}

const useArticleStore = create<ArticleState>((set) => ({
  post: null,
  comments: [],
  setPost: (post) => set({ post }),
  setComments: (comments) => set({ comments }),
}));

export default useArticleStore;