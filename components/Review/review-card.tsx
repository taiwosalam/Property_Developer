import React from "react";
import Link from "next/link";

// Types
import type { ReviewCardProps } from "./types";

// Images
import Dislike from "@/public/icons/dislike.svg";

import VerifiedIcon from "@/public/icons/verified.svg";

// Imports
import clsx from "clsx";
import { empty } from "@/app/config";
import Picture from "../Picture/picture";
import { SectionSeparator } from "../Section/section-components";
import {
  IReviewCard,
  postReaction,
} from "@/app/(nav)/(messages-reviews)/reviews/data";
import BadgeIcon, {
  BadgeIconColors,
  tierColorMap,
} from "../BadgeIcon/badge-icon";
import { DislikeIcon, LikeIcon, ThumbsDown, ThumbsUp } from "@/public/icons/icons";
import { toast } from "sonner";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import useDarkMode from "@/hooks/useCheckDarkMode";

interface ReviewCardProp {
  id: number;
  fullname: string;
  review: string;
  up_vote: number;
  down_vote: number;
  reply_count: number;
  tier_id: number;
  timestamp: string;
  picture: string;
  highlight: boolean;
  user_like: boolean;
  user_dislike: boolean;
}
const ReviewCard: React.FC<ReviewCardProp> = ({ ...props }) => {
  const { userId } = usePersonalInfoStore();
    const isDarkMode = useDarkMode()

  const getBadgeColor = (tier?: number): BadgeIconColors | undefined => {
    if (!tier || tier === 0) return undefined;
    return tierColorMap[tier as keyof typeof tierColorMap] || "blue";
  };

  const handlePostReaction = async (type: number) => {
    if (!props.id) return;
    try {
      const res = await postReaction(props.id, type);
      if (res) {
        if (type === 1) {
          toast.success(`Post liked`);
        } else {
          toast.success("Post dislike");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Link
      href={`/reviews/${props.id}`}
      className={clsx("custom-flex-col gap-4", {
        "bg-neutral-2": props.highlight,
      })}
    >
      <div></div>
      <div className="flex gap-2">
        <div className="flex items-start">
          <Picture
            src={props.picture}
            alt="profile picture"
            size={60}
            rounded
            //status
          />
        </div>
        <div className="custom-flex-col gap-1 flex-1 text-xs font-normal">
          <div className="custom-flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-[10px]">
                <p className="text-text-primary text-base font-medium capitalize">
                  {props.fullname}
                </p>
                {getBadgeColor(props.tier_id) && (
                  <BadgeIcon
                    color={getBadgeColor(props.tier_id) as BadgeIconColors}
                  />
                )}
              </div>
              <p className="text-brand-9 capitalize">
                {props.reply_count}{" "}
                {props.reply_count === 1 ? "reply" : "replies"}
              </p>
            </div>
            <p className="text-text-disabled">{props.review}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <p className="text-text-primary text-xs">View all replies</p>
              <div className="flex gap-[10px]">
                <button
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    handlePostReaction(1);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <LikeIcon
                             fill={`${props?.user_like ? "#E15B0F" : ""} `}
                             stroke={`${props?.user_like ? "#E15B0F" : isDarkMode ? "#FFF" : "#000"} `}
                           />
                  <p className="text-text-disabled">{props.up_vote}</p>
                </button>

                <button
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    handlePostReaction(-1);
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <DislikeIcon
                             fill={`${props?.user_dislike ? "#E15B0F" : "none"} `}
                             stroke={`${props?.user_dislike ? "#E15B0F" : isDarkMode ? "#FFF" : "#000"} `}
                           />
                  <p className="text-text-disabled">{props.down_vote}</p>
                </button>
              </div>
            </div>
            <p className="text-text-disabled">{props.timestamp}</p>
          </div>
        </div>
      </div>
      <SectionSeparator />
    </Link>
  );
};

export default ReviewCard;
