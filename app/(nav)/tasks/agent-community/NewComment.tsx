import { CommentData } from "@/components/tasks/announcements/comment";
import { sendMyArticleComment } from "./my-articles/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { SendMessageIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";

interface ThreadResponse {
  post: any;
  company_summary: any;
  contributor: any;
  comments: CommentData[];
}

interface Props {
  likeCount: number;
  dislikeCount: number;
  handleLike: () => void;
  handleDislike: () => void;
  userAction?: 'like' | 'dislike' | null;
  isLoading: boolean;
  commentCount: number;
  slug: string;
}

const NewComment = ({ commentCount, slug }: Props) => {
    const { data, error, loading, refetch: refetchComments } = useFetch<ThreadResponse>(`/agent_community/${slug}`);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    try {
      console.log("event triggered for comment");
      const status = await sendMyArticleComment(slug, message);
      if (status) {
        window.dispatchEvent(new Event("refetchComments"));
        console.log("event triggered for comment");
      }
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
    <p className="text-text-secondary dark:text-darkText-2 text-sm font-medium mb-4">
      {commentCount === 0 ? "Be the first to comment" : "Add a comment"}
    </p>
    <form onSubmit={handleFormSubmit} className="flex items-center justify-between gap-3">
      <Input
        id="message"
        name="message"
        placeholder="Type your message here"
        disabled={isSubmitting}
        className="w-full"
        inputClassName="border-none bg-neutral-3"
      />
      <button
        type="submit"
        className="bg-brand-9 p-2 rounded grid place-items-center text-white"
        aria-label="send message"
        disabled={isSubmitting}
      >
         {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
          <SendMessageIcon />
        )}
      </button>
    </form>
  </div>
);
}

export default NewComment;