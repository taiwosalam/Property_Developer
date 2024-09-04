import React from "react";

// Images
import Dislike from "@/public/icons/dislike.svg";
import Comment from "@/public/icons/comment.svg";
import Avatar from "@/public/empty/avatar-1.svg";
import VerifiedIcon from "@/public/icons/verified.svg";

// Imports
import Picture from "../Picture/picture";
import { SectionSeparator } from "../Section/section-components";

const Review = () => {
  return (
    <div className="flex gap-1">
      <div className="flex flex-col items-center">
        <Picture src={Avatar} alt="profile picture" size={36} rounded />
        <SectionSeparator direction="y" />
      </div>
      <div className="custom-flex-col gap-3 pb-3">
        <div className="custom-flex-col gap-1">
          <div className="flex items-center gap-[10px]">
            <p className="text-text-primary text-sm font-medium capitalize">
              Awero James
            </p>
            {/* {verified && ( */}
            <Picture src={VerifiedIcon} alt="verified" size={16} />
            {/* )} */}
          </div>
          <p className="text-text-disabled text-xs">
            It is expected that cities and other states capitals without many
            security challenges will witness refinements. Many urban centres
            will witness positive changes in real estate
          </p>
        </div>
        <div className="flex items-center justify-between text-[10px] font-medium">
          <p className="text-text-disabled">Replies</p>
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
        </div>
      </div>
    </div>
  );
};

export default Review;
