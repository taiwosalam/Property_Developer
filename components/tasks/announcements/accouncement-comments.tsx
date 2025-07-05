"use client";

import "keen-slider/keen-slider.min.css";
import Comment from "@/components/tasks/announcements/comment";
import { CommentData } from "@/app/(nav)/community/agent-request/[requestId]/preview/types";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import NewComment from "@/components/Community/PropertyRequestNewComment";
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
import PropertyRequestNewComment from "@/components/Community/PropertyRequestNewComment";
import AnnouncementNewComment from "@/components/Community/announcement-new-comments";

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

const AnnouncementComment = ({
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

  
  const [dislikeCount, setDislikeCount] = useState(() => {
    if (comments && "dislikes" in comments) {
      return parseInt(comments.dislikes as string);
    }
    return 0;
  });

  return (
    <div>
      {!edit && (
        <AnnouncementNewComment
          commentCount={comments?.length || 0}
          id={id}
          slug={slug}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
        />
      )}
      <div className="mt-4"></div>
    </div>
  );
};

export default AnnouncementComment;
