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

const getUniqueCommenters = (comments: CommentProps[]) => {
  const uniqueUsers = new Map();
  
  comments.forEach(comment => {
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

  const uniqueCommenters = getUniqueCommenters(comments);


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
            {uniqueCommenters.slice(0, 3).map((commenter) => (
              <div className="flex" key={commenter.id}>
                <div className="images flex z-30 w-[30px] h-[30px] rounded-full -mr-3">
                  <Image
                    src={commenter?.image ?? empty}
                    alt="commenter avatar"
                    width={30}
                    height={30}
                    className="-mr-3 bg-brand-9 w-full h-full rounded-full object-cover"
                  />
                </div>
              </div>
            ))}
            <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
              {uniqueCommenters.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadArticle;
