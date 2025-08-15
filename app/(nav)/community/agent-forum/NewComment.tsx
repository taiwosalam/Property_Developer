import { CommentData } from "@/components/tasks/announcements/comment";
import { sendMyArticleComment } from "./my-articles/data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { SendMessageIcon } from "@/public/icons/icons";
import Input from "@/components/Form/Input/input";
import { useState } from "react";
import useFetch from "@/hooks/useFetch";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { debounce } from "@/utils/debounce";

interface ThreadResponse {
  post: any;
  company_summary: any;
  contributor: any;
  comments: CommentData[];
}

interface Props {
  likeCount: number;
  dislikeCount: number;
  userAction?: "like" | "dislike" | null;
  commentCount: number;
  slug: string;
}

const NewComment = ({ commentCount, slug }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    data,
    error,
    loading,
    refetch: refetchComments,
  } = useFetch<ThreadResponse>(`/agent_community/${slug}`);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;

    if (!message) return;
    try {
      setIsSubmitting(true);
      const status = await sendMyArticleComment(slug, message);
      if (status) {
        window.dispatchEvent(new Event("refetchComments"));
        console.log("event triggered for comment");
      }
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      console.error("Failed to submit:", error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-6">
      <p className="text-text-secondary dark:text-darkText-2 text-md font-semibold mb-4">
        {commentCount === 0 ? "Be the first to comment" : "Add a comment"}
      </p>
      <form
        onSubmit={handleFormSubmit}
        className="flex items-center justify-between gap-3"
      >
        <CommentTextArea
          placeholder="Type your message here"
          id="message"
          name="message"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          // onClick={handleFormSubmit}
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
};

export default NewComment;

export const CommentTextArea = ({
  className,
  placeholder,
  id,
  name,
  disabled,
  value,
  onChange,
}: {
  className?: string;
  placeholder: string;
  id: string;
  name: string;
  value?: string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
}) => {
  const handleKeyPressSend = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.form;
      if (form) form.requestSubmit();
    }
  };

  return (
    <textarea
      name={name}
      id={id}
      value={value}
      placeholder={placeholder}
      onKeyDown={handleKeyPressSend}
      onChange={onChange}
      className={cn(
        "w-full px-2 py-1 border border-solid border-[#C1C2C366] bg-neutral-3 outline-brand-9 max-h-[80px] rounded-[4px] overflow-y-auto custom-round-scrollbar dark:bg-transparent",
        className
      )}
      disabled={disabled}
      style={{
        resize: "none",
        scrollBehavior: "smooth",
        scrollbarColor: "brand-9",
        msOverflowStyle: "none",
      }}
    ></textarea>
  );
};
