import { DislikeIcon, LikeIcon, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import Image from "next/image";
import React, { useState } from "react";
import { CommentData } from "../tasks/announcements/comment";
import { togglePropertyRequestLike } from "@/app/(nav)/management/agent-community/my-articles/data";
import { toast } from "sonner";
import user1 from "@/public/empty/user1.svg";

interface ThreadArticleProps {
  propertyRequest: any;
  comments: CommentData[];
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

  return (
    <div className="">
      <div
        dangerouslySetInnerHTML={{ __html: propertyRequest?.description }}
        className="text-sm text-darkText-secondary mt-6"
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
            {readByData &&
              readByData.length > 0 &&
              readByData
                .map((reader) => (
                  <div className="flex" key={reader.viewed_at}>
                    <div className="images flex z-30 w-[30px] h-[30px] rounded-full -mr-3">
                      <Image
                        key={reader.viewed_at}
                        src={reader.profile_picture ?? user1}
                        alt="blog"
                        width={30}
                        height={30}
                        className="-mr-3 bg-brand-9 w-full h-full rounded-full object-cover"
                      />
                    </div>
                  </div>
                ))
                .slice(0, 3)}
            <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
              {readByData?.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadArticle;
