import {
  DislikeIcon,
  LikeIcon,
  ThumbsDown,
  ThumbsUp,
} from "@/public/icons/icons";
import Image from "next/image";
import React, { useState } from "react";
import { togglePropertyRequestLike } from "@/app/(nav)/community/agent-forum/my-articles/data";
import { toast } from "sonner";
import user1 from "@/public/empty/user1.svg";
import { empty } from "@/app/config";
import { CommentProps } from "@/app/(nav)/community/agent-forum/type";
import clsx from "clsx";

const getUniqueCommenters = (comments: CommentProps[]) => {
  const uniqueUsers = new Map();

  comments.forEach((comment) => {
    if (comment.name && !uniqueUsers.has(comment.name)) {
      uniqueUsers.set(comment.name, {
        id: comment.name,
        image: comment.image,
      });
    }
  });

  return Array.from(uniqueUsers.values());
};

interface ThreadArticleProps {
  propertyRequest: any;
  comments: CommentProps[];
  readByData: {
    name: string;
    profile_picture: string;
    email_verified: boolean;
    viewed_at: string;
  }[];
}

const maxImagesToShow = 3;

const ThreadArticle = ({
  propertyRequest,
  comments,
  readByData,
}: ThreadArticleProps) => {
  const [isLike, setIsLike] = useState(false);

  const handleToggleLike = async (type: string) => {
    try {
      setIsLike(true);
      await togglePropertyRequestLike(propertyRequest.slug, type);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLike(false);
    }
  };

  // Get unique, non-null user images from comments
  const uniqueUserImages = Array.from(
    new Map(
      (comments || [])
        .filter((comment) => comment.image != null) // Exclude null or undefined images
        .map((comment) => [comment.image, comment.image as string]) // Map to [image, image] pairs
    ).values()
  ).slice(0, maxImagesToShow);

  const uniqueCommenterCount = new Set(
    (comments || [])
      .filter((comment) => comment.image != null)
      .map((comment) => comment.image)
  ).size;

  const excessImagesCount = Math.max(uniqueCommenterCount - maxImagesToShow, 0);

  return (
    <div className="">
      <div
        dangerouslySetInnerHTML={{ __html: propertyRequest?.description }}
        className="text-sm text-darkText-secondary mt-6 first-letter:uppercase"
      />
      <div className="flex justify-between mt-6">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">Comments</span>
          <p className="text-white text-xs text-center font-semibold rounded-full bg-brand-9 px-3 py-[2px]">
            {propertyRequest?.commentsCount}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            disabled={isLike}
            className="flex items-center gap-1"
            onClick={() => handleToggleLike("1")}
          >
            <LikeIcon
              fill={`${propertyRequest?.user_liked ? "#E15B0F" : ""} `}
              stroke={`${propertyRequest?.user_liked ? "#E15B0F" : "#000"} `}
            />
            <p>{propertyRequest?.likesUp}</p>
          </button>
          <button
            disabled={isLike}
            className="flex items-center gap-1"
            onClick={() => handleToggleLike("-1")}
          >
            <DislikeIcon
              fill={`${propertyRequest?.user_disliked ? "#E15B0F" : "none"} `}
              stroke={`${propertyRequest?.user_disliked ? "#E15B0F" : "#000"} `}
            />
            <p>{propertyRequest?.likesDown}</p>
          </button>

          <div className="flex items-center">
            {uniqueUserImages.map((image, index) => (
              <Image
                key={index}
                src={image || empty}
                alt="user avatar"
                width={24}
                height={24}
                className={clsx(
                  "w-6 h-6 border border-brand-9 rounded-full object-cover",
                  index !== 0 && "-ml-3"
                )}
                style={{ zIndex: index }} // control stacking
              />
            ))}
            {excessImagesCount > 0 && (
              <div className="bg-brand-9 h-6 pl-[14px] pr-[10px] -ml-3 rounded-[24px] text-[10px] text-text-invert font-semibold flex items-center justify-end">
                +{excessImagesCount}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadArticle;
