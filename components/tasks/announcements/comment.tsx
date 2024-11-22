"use client"
import Image from "next/image";
import { empty } from "@/app/config";
import { useEffect, useState } from "react";
import {
  ReplyIcon,
  SendMessageIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Input from "@/components/Form/Input/input";
import { Loader2 } from "lucide-react";
import { toggleCommentLike } from "@/app/(nav)/tasks/agent-community/my-articles/data";

// Base comment data structure
export interface CommentData {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentData[];
  commentsCount: number;
  parentId?: string | number;
}

// Handler functions interface
interface CommentHandlers {
  handleLike: (id: string | number) => void;
  handleDislike: (id: string | number) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

// Props for the Comment component
type CommentProps = CommentData & CommentHandlers & {
  showInput?: boolean;
  setShowInput?: (show: boolean) => void;
}

const Comment: React.FC<CommentProps> = ({
  id,
  name,
  text,
  likes,
  dislikes,
  replies,
  handleSubmit,
  showInput: propShowInput,
  setShowInput: propSetShowInput,
  handleLike,
  handleDislike,
  commentsCount,
  parentId,
}) => {
  const [localShowInput, setLocalShowInput] = useState(false);
  const [localCommenting, setLocalCommenting] = useState(false);
  const [localCommentId, setLocalCommentId] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const showInput = propShowInput ?? localShowInput;
  const setShowInput = propSetShowInput ?? setLocalShowInput;

  const handleReplyClick = (id: string | number) => {
    setShowInput(!showInput);
    setLocalCommenting(true);
    setLocalCommentId(Number(id));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      formData.append('parentId', parentId?.toString() || id.toString());
      
      await handleSubmit?.(e);
      setShowInput(false);
    } catch (error) {
      console.error('Failed to submit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCommentLike = async () => {
    setIsLoading(true);
  
    try {
      handleLike(parentId || id);
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCommentDislike = async () => {
    setIsLoading(true);
    try {
      handleDislike(parentId || id);
    } catch (error) {
      console.error('Error toggling dislike:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <div data-comment-id={id}>
      <div className="flex items-center gap-1">
        <div className="flex-shrink-0 relative w-9 h-9 rounded-full bg-neutral-2 overflow-hidden">
          <Image
            src={empty}
            alt="user-real-info-from-props"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-1">
          <p className="text-text-primary dark:text-white text-sm font-medium flex items-center">
            <span className="text-ellipsis line-clamp-1">{name}</span>
            <BadgeIcon color="yellow" />
          </p>
          <p className="text-text-secondary dark:text-darkText-2 text-sm font-medium">
            {text}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 justify-end mt-2">
      <button
          type="button"
          onClick={() => handleReplyClick(id)}
          className="text-text-quaternary dark:text-darkText-1 flex items-center gap-1"
        >
          <ReplyIcon />
          <span className="text-[10px] font-normal">Reply</span>
        </button>
        <button 
          className={`flex items-center gap-1 ${isLoading ? "text-blue-500" : "text-black"}`} 
          onClick={handleCommentLike}
        >
          <ThumbsUp />
          <span className="text-xs font-normal">{likes}</span>
        </button>
        <button 
          className="flex items-center gap-1 text-text-disabled" 
          onClick={handleCommentDislike}
        >
          <ThumbsDown />
          <span className="text-xs font-normal">{dislikes}</span>
        </button>
      </div>
      {(showInput || commentsCount === 0) && (
        <form 
          onSubmit={handleFormSubmit}
          className="mt-6 mb-4 flex items-center justify-between gap-3"
        >
          <input 
            type="hidden" 
            name="parentId" 
            value={parentId || id} 
          />
          <Input
            id={`${id}`}
            name="reply"
            placeholder="Type your reply here"
            className="w-full"
            inputClassName="border-none bg-neutral-3"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="bg-brand-9 p-2 rounded grid place-items-center"
            aria-label="send message"
            disabled={isSubmitting}
          >
            <span className="text-white">
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <SendMessageIcon />
              )}
            </span>
          </button>
        </form>
      )}

      {replies && replies.length > 0 && (
        <>
          <p className="ml-10 my-2 text-neutral-4 text-[10px] font-medium">
            Replies
          </p>
          <div className="relative ml-10 pl-5 border-l border-neutral-300">
            {replies.map((r) => (
              <Comment 
                key={r.id} 
                {...r} 
                handleLike={handleLike} 
                handleDislike={handleDislike}
                handleSubmit={handleSubmit}
                parentId={r.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Comment;
