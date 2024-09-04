import React from "react";

// Images
import Dislike from "@/public/icons/dislike.svg";
import Comment from "@/public/icons/comment.svg";
import Avatar from "@/public/empty/avatar-1.svg";
import VerifiedIcon from "@/public/icons/verified.svg";

// Imports
import Picture from "../Picture/picture";
import { SectionSeparator } from "../Section/section-components";
import { ReviewProps } from "./types";

const Review: React.FC<ReviewProps> = ({
  pfp = Avatar,
  desc,
  main,
  fullname,
  verified,
}) => {
  return (
    <div className="flex gap-1">
      <div className="flex flex-col items-center">
        <Picture src={pfp} alt="profile picture" size={36} rounded />
        <SectionSeparator direction="y" />
      </div>
      <div className="custom-flex-col gap-3 pb-3 flex-1">
        <div className="custom-flex-col gap-1">
          <div className="flex items-center gap-[10px]">
            <p className="text-text-primary text-sm font-medium capitalize">
              {fullname}
            </p>
            {verified && (
              <Picture src={VerifiedIcon} alt="verified" size={16} />
            )}
          </div>
          <p className="text-text-disabled text-xs">
            {desc ||
              "Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi sequi, harum error ut dolores accusamus nesciunt velit amet rem. Ipsa."}
          </p>
        </div>
        <div className="flex items-center justify-between text-[10px] font-medium">
          {main ? (
            <p className="text-text-disabled">Replies</p>
          ) : (
            <>
              <div></div>
              <div className="flex gap-[10px]">
                <button className="flex gap-1">
                  <Picture src={Comment} alt="reply" size={16} />
                  <p className="text-text-secondary">Reply</p>
                </button>
                <button className="flex gap-1">
                  <Picture src={Dislike} alt="dislike" size={16} />
                  <p className="text-text-disabled">0</p>
                </button>
                <button className="flex gap-1">
                  <Picture src={Dislike} alt="dislike" size={16} />
                  <p className="text-text-disabled">0</p>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
