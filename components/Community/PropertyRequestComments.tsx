"use client";

import "keen-slider/keen-slider.min.css";
import Comment from "@/components/tasks/announcements/comment";
import { CommentData } from "@/app/(nav)/community/agent-request/[requestId]/preview/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewComment from "./PropertyRequestNewComment";
// import {
//   sendMyPropertyRequestComment,
//   sendMyArticleReply,
//   toggleCommentLike,
//   sendMyPropertyRequestReply,
//   togglePropertyRequestCommentLike,
// } from "@/app/(nav)/community/agent-community/my-articles/data";

import {
  sendMyPropertyRequestComment,
  sendMyPropertyRequestReply,
  togglePropertyRequestCommentLike,
} from "@/app/(nav)/community/agent-forum/my-articles/data";
import PropertyRequestNewComment from "./PropertyRequestNewComment";
import CommunityComments from "./CommunityComments";
//import { CommentProps } from "@/app/(nav)/community/agent-community/type";

export interface CommentProps {
  id: string | number;
  name: string;
  text: string;
  likes: number;
  dislikes: number;
  replies?: CommentProps[];
}

interface ThreadCommentProps {
  id: string;
  slug: string;
  comments:
    | CommentProps[]
    | (CommentData[] & {
        likes?: string | number;
        dislikes?: string | number;
      });
  setComments: React.Dispatch<React.SetStateAction<CommentData[]>>;
  edit?: boolean;
}

const PropertyRequestComments = ({
  id,
  slug,
  comments,
  edit,
  setComments,
}: ThreadCommentProps) => {
  //
  const [likeCount, setLikeCount] = useState(() => {
    if (comments && "likes" in comments) {
      return parseInt(comments.likes as string);
    }
    return 0;
  });
  const [commenting, setCommenting] = useState(false);
  const [commentId, setCommentId] = useState<string | number | null>(null);
  const [dislikeCount, setDislikeCount] = useState(() => {
    if (comments && "dislikes" in comments) {
      return parseInt(comments.dislikes as string);
    }
    return 0;
  });
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (id: string, commentId: string | number) => {
    if (isLoading || userAction === "like") return;
    setIsLoading(true);

    try {
      await togglePropertyRequestCommentLike(id, String(commentId), 1);
      if (userAction === "dislike") {
        setDislikeCount((prev) => prev - 1);
      }
      setLikeCount((prev) => prev + 1);
      setUserAction("like");
      window.dispatchEvent(new Event("refetchComments"));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async (id: string, commentId: string | number) => {
    if (isLoading || userAction === "dislike") return;
    setIsLoading(true);

    try {
      await togglePropertyRequestCommentLike(id, String(commentId), -1);
      if (userAction === "like") {
        setLikeCount((prev) => prev - 1);
      }
      setDislikeCount((prev) => prev + 1);
      setUserAction("dislike");
      window.dispatchEvent(new Event("refetchComments"));
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get("message") as string;
    const reply = formData.get("reply") as string;
    const parentId = formData.get("parentId") as string;
    setCommentId(parentId);

    if (!message && !reply) return;

    try {
      setCommenting(true);
      if (reply && parentId) {
        // Send reply to the server
        const status = await sendMyPropertyRequestReply(slug, parentId, reply);
        if (status) {
          window.dispatchEvent(new Event("refetchComments"));
        }
      } else if (message) {
        // Send comment to the server
        const status = await sendMyPropertyRequestComment(slug, message);
        if (status) {
          window.dispatchEvent(new Event("refetchComments"));
        }
      }
    } catch (error) {
      toast.error("Failed to add comment/reply");
    } finally {
      setCommenting(false);
    }
  };

  return (
    <div>
      {!edit && (
        <PropertyRequestNewComment
          commentCount={comments?.length || 0}
          id={id}
          slug={slug}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
        />
      )}
      <div className="mt-4">
        {/* <CommunityComments 
          slug={slug}
          comments={comments}
          setComments={setComments}/> */}
        {/* {comments?.map((comment) => (
          <Comment
            key={comment.id}
            {...comment}
            handleLike={(commentId: string | number) =>
              handleLike(id, commentId2)
            }
            handleDislike={(commentId: string | number) =>
              handleDislike(id, commentId)
            }
            handleSubmit={handleSubmit}
          />
        ))} */}
      </div>
    </div>
  );
};

export default PropertyRequestComments;
