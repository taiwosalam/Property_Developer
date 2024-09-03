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

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  desc,
  time,
  pfp = empty,
  replies = 0,
  fullname,
  verified,
  highlight,
}) => {
  return (
    <Link
      href={`/reviews/${id}`}
      className={clsx("custom-flex-col gap-4", {
        "bg-neutral-2": highlight,
      })}
    >
      <div></div>
      <div className="flex gap-2">
        <div className="flex items-start">
          <Picture src={pfp} alt="profile picture" size={60} rounded status />
        </div>
        <div className="custom-flex-col gap-1 flex-1 text-xs font-normal">
          <div className="custom-flex-col gap-2">
            <div className="flex justify-between">
              <div className="flex items-center gap-[10px]">
                <p className="text-text-primary text-base font-medium capitalize">
                  {fullname}
                </p>
                {verified && (
                  <Picture src={VerifiedIcon} alt="verified" size={16} />
                )}
              </div>
              <p className="text-brand-9 capitalize">
                {replies} {replies === 1 ? "reply" : "replies"}
              </p>
            </div>
            <p className="text-text-disabled">{desc}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-4">
              <p className="text-text-primary">View all replies</p>
              <div className="flex gap-[10px]">
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
            <p className="text-text-disabled">{time}</p>
          </div>
        </div>
      </div>
      <SectionSeparator />
    </Link>
  );
};

export default ReviewCard;
