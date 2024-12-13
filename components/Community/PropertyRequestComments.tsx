"use client";

import "keen-slider/keen-slider.min.css";
import Comment, { CommentData } from "@/components/tasks/announcements/comment";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewComment from "../../app/(nav)/management/agent-community/NewComment";
import { sendMyPropertyRequestComment, sendMyArticleReply, toggleCommentLike, sendMyPropertyRequestReply, togglePropertyRequestCommentLike } from "@/app/(nav)/management/agent-community/my-articles/data";
import PropertyRequestNewComment from "./PropertyRequestNewComment";

interface ThreadCommentProps {
    id: string;
    slug: string;
    comments: CommentData[] & {
      likes?: string | number;
      dislikes?: string | number;
    };
    setComments: React.Dispatch<React.SetStateAction<CommentData[]>>;
    edit?: boolean;
}

const PropertyRequestComments = ({
    id,
    slug,
    comments,
    edit,
  }: ThreadCommentProps) => {
    console.log("comments", comments);
    const [likeCount, setLikeCount] = useState(() => {
      if (comments && 'likes' in comments) {
        return parseInt(comments.likes as string);
      }
      return 0;
    });
    const [commenting, setCommenting] = useState(false);
    const [commentId, setCommentId] = useState<string | number | null>(null);
    const [dislikeCount, setDislikeCount] = useState(() => {
      if (comments && 'dislikes' in comments) {
        return parseInt(comments.dislikes as string);
      }
      return 0;
    });
    const [userAction, setUserAction] = useState<'like' | 'dislike' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
  
    const handleLike = async (id: string, commentId: string | number) => {
      console.log('like clicked', commentId);
      if (isLoading || userAction === 'like') return;
      setIsLoading(true);
      
      try {
        await togglePropertyRequestCommentLike(id, String(commentId), 1);
        if (userAction === 'dislike') {
          setDislikeCount(prev => prev - 1);
        }
        setLikeCount(prev => prev + 1);
        setUserAction('like');
        window.dispatchEvent(new Event("refetchComments"));
      } catch (error) {
        console.error('Error toggling like:', error);
      } finally {
        setIsLoading(false);
    }
    };
  
  
    const handleDislike = async (id: string, commentId: string | number) => {
      console.log('dislike clicked', commentId);
      if (isLoading || userAction === 'dislike') return;
      setIsLoading(true);
  
      try { 
        await togglePropertyRequestCommentLike(id, String(commentId), -1);
        if (userAction === 'like') {
          setLikeCount(prev => prev - 1);
        }
        setDislikeCount(prev => prev + 1);
        setUserAction('dislike');
        window.dispatchEvent(new Event("refetchComments"));
      } catch (error) {
        console.error('Error toggling dislike:', error);
      } finally {
        setIsLoading(false);
    }
    console.log('dislikeCount', dislikeCount);
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
            console.log("event triggered for reply");
          }
        } else if (message) {
          // Send comment to the server
          const status = await sendMyPropertyRequestComment(slug, message);
          if (status) {
            window.dispatchEvent(new Event("refetchComments"));
            console.log("event triggered for commentx");
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
       {!edit && 
        <PropertyRequestNewComment
          commentCount={comments?.length || 0}
          id={id}
          slug={slug}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
        />}
        <div className="mt-4">
          {comments?.map((comment) => (
            <Comment
              key={comment.id}
              {...comment}
              handleLike={(commentId: string | number) => handleLike(id, commentId)}
              handleDislike={(commentId: string | number) => handleDislike(id, commentId)}
              handleSubmit={handleSubmit}
            />
          ))}
        </div>
      </div>
    );
  };

export default PropertyRequestComments;
