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
import BadgeIcon, {
  BadgeIconColors,
  tierColorMap,
} from "../BadgeIcon/badge-icon";
import { postReaction } from "@/app/(nav)/(messages-reviews)/reviews/data";
import { toast } from "sonner";
import { empty } from "@/app/config";

const Review: React.FC<ReviewProps> = ({
  id,
  pfp = empty,
  desc,
  main,
  fullname,
  verified,
  tier_id,
}) => {
  const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
    if (!tier || tier === 0) return undefined;
    return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
  };

  const handlePostReaction = async (type: number) => {
    if (!id) return;
    try {
      const res = await postReaction(id, type);
      if (res) {
        toast.success(`Post ${type}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex gap-1">
      <div className="flex flex-col items-center">
        <Picture src={pfp} alt="profile picture" size={36} rounded />
        <SectionSeparator direction="y" className="bg-gray-200" />
      </div>
      <div className="custom-flex-col gap-3 pb-3 flex-1 ml-3">
        <div className="custom-flex-col gap-1">
          <div className="flex items-center gap-1">
            <p className="text-text-primary text-sm font-medium capitalize">
              {fullname}
            </p>
            {getBadgeColor(tier_id) && (
              <BadgeIcon color={getBadgeColor(tier_id) as BadgeIconColors} />
            )}
          </div>
          <p className="text-text-disabled text-xs mt-1">{desc}</p>
        </div>
        <div className="flex items-center justify-between text-[10px] font-medium">
          {main ? (
            <p className="text-text-disabled"></p>
          ) : (
            <>
              <div></div>
              <div className="flex gap-[10px]">
                <button className="flex gap-1">
                  <Picture src={Comment} alt="reply" size={16} />
                  <p className="text-text-secondary">Reply</p>
                </button>
                <button
                  className="flex gap-1"
                  onClick={() => handlePostReaction(-1)}
                >
                  <Picture src={Dislike} alt="dislike" size={16} />
                  <p className="text-text-disabled">0</p>
                </button>
                <button
                  className="flex gap-1"
                  onClick={() => handlePostReaction(1)}
                >
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
