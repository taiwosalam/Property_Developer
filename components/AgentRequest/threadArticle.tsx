import { ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import Image from "next/image";
import React from "react";
import { CommentData } from "../tasks/announcements/comment";

const ThreadArticle = ({
  propertyRequest,
  comments,
}: {
  propertyRequest: any;
  comments: CommentData[];
}) => {
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
            {propertyRequest?.comments_count}
          </p>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1">
            <ThumbsUp />
            <p>{propertyRequest?.likes_up}</p>
          </button>
          <button className="flex items-center gap-1">
            <ThumbsDown />
            <p>{propertyRequest?.likes_down}</p>
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
                  className="-mr-2 h-[30px] w-[30px] object-cover rounded-full  custom-secondary-bg"
                />
              ))}
            </div>
            <div className="rounded-r-[23px] w-[48px] h-[23px] flex-shrink-0 bg-brand-9 z-10 flex items-center justify-center text-[10px] font-semibold tracking-[0px] text-white">
              +{comments.length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThreadArticle;
