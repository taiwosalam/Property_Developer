"use client";

import { useState } from "react";
import { CommentData } from "../tasks/announcements/comment";
import { toggleLike } from "@/app/(nav)/management/agent-community/my-articles/data";
import { ThreadArticleSkeleton } from "@/app/(nav)/management/agent-community/components";
import DOMPurify from "dompurify";
import { ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import Image from "next/image";

const PreviewThreadArticle = ({
  post,
  slug,
  comments,
}: {
  post: any;
  slug: string;
  comments: CommentData[];
}): JSX.Element => {
  const [likeCount, setLikeCount] = useState(
    post?.likes_up ? parseInt(post?.likes_up) : 0
  );
  const [dislikeCount, setDislikeCount] = useState(
    post?.likes_down ? parseInt(post?.likes_down) : 0
  );
  const [userAction, setUserAction] = useState<"like" | "dislike" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async () => {
    // console.log('like clicked');
    if (isLoading || userAction === "like") return;
    setIsLoading(true);

    try {
      await toggleLike(slug, 1);
      if (userAction === "dislike") {
        setDislikeCount((prev) => prev - 1);
      }
      setLikeCount((prev) => prev + 1);
      setUserAction("like");
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDislike = async () => {
    console.log("dislike clicked");
    if (isLoading || userAction === "dislike") return;
    setIsLoading(true);

    try {
      await toggleLike(slug, -1);
      if (userAction === "like") {
        setLikeCount((prev) => prev - 1);
      }
      setDislikeCount((prev) => prev + 1);
      setUserAction("dislike");
    } catch (error) {
      console.error("Error toggling dislike:", error);
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
          <span className="text-text-secondary">Comments</span>
          {/* <p className="text-white text-xs font-semibold rounded-full bg-brand-9 px-3 py-[2px]">{post?.comments_count}</p> */}
        </div>

        <div className="flex gap-2">
          <button
            className={`flex items-center gap-1 ${
              userAction === "like" ? "text-blue-500" : ""
            }`}
            disabled={isLoading}
            onClick={handleLike}
          >
            <ThumbsUp />
            <p>{likeCount}</p>
          </button>
          <button
            className={`flex items-center gap-1 ${
              userAction === "dislike" ? "text-red-500" : ""
            }`}
            onClick={handleDislike}
            disabled={isLoading}
          >
            <ThumbsDown />
            <p>{dislikeCount}</p>
          </button>

          <div className="flex items-center">
            <div className="images flex z-30">
              {comments.slice(0, 3).map((comment, index) => (
                <Image
                  key={index}
                  src={comment.profile_picture}
                  alt={`commenter ${index + 1}`}
                  width={300}
                  height={300}
                  className="-mr-2 h-[30px] w-[30px] object-cover rounded-full"
                />
              ))}
            </div>
            <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
              +{post?.comments_count}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewThreadArticle;
