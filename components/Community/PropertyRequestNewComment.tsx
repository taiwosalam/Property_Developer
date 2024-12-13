import { CommentData } from "@/components/tasks/announcements/comment";
import { sendMyPropertyRequestComment } from "@/app/(nav)/management/agent-community/my-articles/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { SendMessageIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CommentTextArea } from "@/app/(nav)/management/agent-community/NewComment";

interface ThreadResponse {
  post: any;
  company_summary: any;
  contributor: any;
  comments: CommentData[];
}

interface Props {
  likeCount: number;
  dislikeCount: number;
  userAction?: 'like' | 'dislike' | null;
  commentCount: number;
  id: string;
  slug: string;
}

const NewComment = ({ commentCount, id, slug }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data, error, loading, refetch: refetchComments } = useFetch<ThreadResponse>(`/agent_community/${id}`);


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("id -", id)
    
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    
    if (!message) return;
    try {
      setIsSubmitting(true);
      const status = await sendMyPropertyRequestComment(slug, message);
      if (status) {
        window.dispatchEvent(new Event("refetchComments"));
        console.log("event triggered for comment");
      }
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error('Failed to submit:', error);
      toast.error("Failed to add comment");
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
       <CommentTextArea 
          placeholder="Type your message here"
          id="message"
          name="message"
          disabled={isSubmitting}
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