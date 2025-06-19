"use client";

import "keen-slider/keen-slider.min.css";
import Comment, { CommentData } from "@/components/tasks/announcements/comment";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewComment from "../../app/(nav)/community/agent-forum/NewComment";
import {
  sendMyArticleComment,
  sendMyArticleReply,
  toggleCommentLike,
} from "@/app/(nav)/community/agent-forum/my-articles/data";
import { WeekNumberFormatter } from "react-day-picker";

interface ThreadCommentProps {
  slug: string;
  comments: CommentData[] & {
    likes?: string | number;
    dislikes?: string | number;
  };
  setComments: React.Dispatch<React.SetStateAction<CommentData[]>>;
  edit?: boolean;
}

const CommunityComments = ({ slug, comments, edit }: ThreadCommentProps) => {
  const [likeCount, setLikeCount] = useState(() => {
    if (comments && "likes" in comments) {
      return parseInt(comments.likes as string);
    }
    return 0;
  });
  const [commenting, setCommenting] = useState(false);
  const [dislikeCount, setDislikeCount] = useState(() => {
    if (comments && "dislikes" in comments) {
      return parseInt(comments.dislikes as string);
    }
    return 0;
  });
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    const reply = formData.get("reply") as string;
    const parentId = formData.get("parentId") as string;

    if (!message && !reply) return;

    try {
      setCommenting(true);
      if (reply && parentId) {
        // Send reply to the server
        const status = await sendMyArticleReply(slug, parentId, reply);
        if (status) {
          window.dispatchEvent(new Event("refetchComments"));
        }
      } else if (message) {
        // Send comment to the server
        const status = await sendMyArticleComment(slug, message);
        if (status) {
          window.dispatchEvent(new Event("refetchComments"));
        }
      }
    } catch (error) {
      toast.error("Failed to add comment/reply");
      console.error("Error adding comment/reply:", error);
    } finally {
      setCommenting(false);
    }
  };

  return (
    <div>
      {!edit && (
        <NewComment
          commentCount={comments.length || 0}
          slug={slug}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
        />
      )}
      <div className="mt-4">
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            handleSubmit={handleSubmit}
          />
        ))}
      </div>
    </div>
  );
};

export default CommunityComments;
