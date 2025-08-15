"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import {
  DislikeIcon,
  LikeIcon,
  ReplyIcon,
  SendMessageIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";
import BadgeIcon, { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { empty } from "@/app/config";
import { CommentTextArea } from "@/app/(nav)/community/agent-forum/NewComment";
import { toggleCommentLike } from "@/app/(nav)/community/agent-forum/my-articles/data";
import useDarkMode from "@/hooks/useCheckDarkMode";
import TruncatedText from "@/components/TruncatedText/truncated-text";

// Base comment data structure
export interface CommentData {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentData[];
  commentsCount: number;
  profile_picture: string;
  parentId?: string | number;
}

// Handler functions interface
interface CommentHandlers {
  toggleLike?: (id: string | number, type: number) => void;
  handleLike?: (id: string | number, type: number) => void;
  handleDislike?: (id: string | number) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

// Props for the Comment component
type CommentProps = CommentData &
  CommentHandlers & {
    showInput?: boolean;
    tier?: number;
    user_liked?: boolean;
    user_disliked?: boolean;
    setShowInput?: (show: boolean) => void;
  };

const Comment: React.FC<CommentProps> = ({
  id,
  name,
  tier,
  text,
  likes,
  dislikes,
  profile_picture,
  replies,
  commentsCount,
  parentId,
  user_liked = false,
  user_disliked = false,
  handleSubmit,
  showInput: propShowInput,
  setShowInput: propSetShowInput,
  toggleLike,
  handleLike,
  handleDislike,
}) => {
  const isDarkMode = useDarkMode();
  const [localShowInput, setLocalShowInput] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(
    user_liked ? "like" : null
  );
  const [showReplies, setShowReplies] = useState(false);

  // Use provided showInput/setShowInput or fall back to local state
  const showInput = propShowInput ?? localShowInput;
  const setShowInput = propSetShowInput ?? setLocalShowInput;

  const badgeColor =
    tier && tier > 1
      ? // ? tierColorMap[tier as keyof typeof tierColorMap]
        "gray"
      : undefined;

  // Handle reply button click
  const handleReplyClick = useCallback(() => {
    setShowInput(!showInput);
  }, [showInput, setShowInput]);

  // Handle form submission for replies
  const onSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsSubmitting(true);

      try {
        const formData = new FormData(e.target as HTMLFormElement);
        formData.append("parentId", parentId?.toString() || id.toString());
        await handleSubmit(e);
        setShowInput(false);
        window.dispatchEvent(new Event("refetchComments"));
      } catch (error) {
        console.error("Failed to submit comment:", error);
        toast.error("Failed to submit reply");
      } finally {
        setIsSubmitting(false);
      }
    },
    [handleSubmit, id, parentId, setShowInput]
  );

  const handleToggleLike = async (type: number) => {
    try {
      setIsLoading(true);
      const res = await toggleCommentLike(String(parentId || id), type);
      if (res) {
        window.dispatchEvent(new Event("refetchComments"));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div data-comment-id={id} className="space-y-2">
      {/* User Info */}
      <div className="flex items-center gap-2">
        <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-neutral-2">
          <Image
            src={profile_picture || empty}
            alt={`${name}'s profile picture`}
            fill
            className="object-cover bg-brand-9"
          />
        </div>
        <p className="flex items-center text-sm lg:text-md font-semibold text-text-primary dark:text-white">
          <span className="line-clamp-1 capitalize">{name}</span>
          {badgeColor && <BadgeIcon color={badgeColor} />}
        </p>
      </div>

      {/* Comment Text */}
      <div className="pl-[3em]">
        <TruncatedText lines={3} as="div">
          <p className="text-sm font-medium text-text-secondary dark:text-darkText-2">
            {text.split("\r\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < text.split("\r\n").length - 1 && <br />}
              </span>
            ))}
          </p>
        </TruncatedText>
      </div>

      {/* Actions (Reply, Like, Dislike) */}
      <div className="mt-2 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleReplyClick}
          className="flex items-center gap-1 text-text-quaternary dark:text-darkText-1"
        >
          <ReplyIcon />
          <span className="text-[10px] font-normal">Reply</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1"
          // disabled={isLoading}
          onClick={() => handleToggleLike(1)}
        >
          <LikeIcon
            fill={`${user_liked ? "#E15B0F" : ""} `}
            stroke={`${user_liked ? "#E15B0F" : isDarkMode ? "#FFF" : "#000"} `}
          />
          <span className="text-xs font-normal">{likes}</span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1"
          // disabled={isLoading}
          onClick={() => handleToggleLike(-1)}
        >
          <DislikeIcon
            fill={`${user_disliked ? "#E15B0F" : "none"} `}
            stroke={`${
              user_disliked ? "#E15B0F" : isDarkMode ? "#FFF" : "#000"
            } `}
          />
          <span className="text-xs font-normal">{dislikes}</span>
        </button>
      </div>

      {/* Reply Form */}
      {(showInput || commentsCount === 0) && (
        <form onSubmit={onSubmit} className="my-2 flex items-center gap-3">
          <input type="hidden" name="parentId" value={parentId || id} />
          <CommentTextArea
            placeholder="Type your reply here"
            id={`${id}`}
            name="reply"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="grid place-items-center rounded bg-brand-9 text-white p-2"
            aria-label="Send reply"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin text-white" />
            ) : (
              <SendMessageIcon />
            )}
          </button>
        </form>
      )}

      {/* Replies */}
      {replies && replies.length > 0 && (
        <>
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="mb-2 ml-10 text-[10px] font-medium text-neutral-4"
          >
            {showReplies
              ? "Hide replies"
              : `View replies - (${replies.length})`}
          </button>
          {showReplies && (
            <div className="relative ml-10 border-l border-neutral-300 pl-5">
              {replies.map((reply) => (
                <Comment
                  key={reply.id}
                  {...reply}
                  // handleLike={handleLike}
                  // handleDislike={handleDislike}
                  handleSubmit={handleSubmit}
                  parentId={reply.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Comment;
