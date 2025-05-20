"use client";

import { useState } from "react";
import { CommentData } from "../tasks/announcements/comment";
import { toggleLike } from "@/app/(nav)/management/agent-community/my-articles/data";
import { ThreadArticleSkeleton } from "@/app/(nav)/management/agent-community/components";
import DOMPurify from "dompurify";
import {
  DislikeIcon,
  LikeIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";
import Image from "next/image";
import { empty } from "@/app/config";

const PreviewThreadArticle = ({
  post,
  slug,
  comments,
}: {
  post: any;
  slug: string;
  comments: CommentData[];
}): JSX.Element => {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleLike = async (type: number) => {
    try {
      setIsLoading(true);
      const res = await toggleLike(slug, type);
      if (res) {
        window.dispatchEvent(new Event("refetchComments"));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!post) {
    return <ThreadArticleSkeleton />;
  }

  const sanitizedHTML = DOMPurify.sanitize(post?.content || "");

  return (
    <div className="mt-4">
      <div
        className="text-sm text-darkText-secondary mt-2"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
      <div className="flex justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary font-semibold text-md">
            Comments
          </span>
        </div>

        <div className="flex gap-2">
          <button
            className="flex items-center gap-1"
            disabled={isLoading}
            onClick={() => handleToggleLike(1)}
          >
            <LikeIcon
              fill={`${post.user_liked ? "#E15B0F" : ""} `}
              stroke={`${post.user_liked ? "#E15B0F" : "#000"} `}
            />
            <p>{post.likes_up}</p>
          </button>
          <button
            className="flex items-center gap-1"
            disabled={isLoading}
            onClick={() => handleToggleLike(-1)}
          >
            <DislikeIcon
              fill={`${post.user_disliked ? "#E15B0F" : "none"} `}
              stroke={`${post.user_disliked ? "#E15B0F" : "#000"} `}
            />
            <p>{post.likes_down}</p>
          </button>

          <div className="flex items-center">
            <div className="images flex z-30 rounded-full  h-[30px] w-[30px] -mr-2">
              {comments.slice(0, 3).map((comment, index) => (
                <Image
                  key={index}
                  src={comment.profile_picture || empty}
                  alt={`commenter ${index + 1}`}
                  width={300}
                  height={300}
                  className="-mr-2 h-full w-full object-cover rounded-full bg-brand-9"
                />
              ))}
            </div>
            {post?.comments_count > 0 && (
              <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
                +{post?.comments_count}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewThreadArticle;
