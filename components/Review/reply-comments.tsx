// ReplyComment.tsx (New Component)
import React from "react";
import Picture from "../Picture/picture";
import { empty } from "@/app/config";
import { SectionSeparator } from "../Section/section-components";
import BadgeIcon, { BadgeIconColors } from "../BadgeIcon/badge-icon";
import { getBadgeColor } from "@/lib/utils";

interface ReplyCommentProps {
  id: number;
  name: string;
  user_id: number;
  tier_id: number;
  tier?: string;
  comment: string;
  created_at: string;
  user_profile_picture_url: string;
  profile_picture?: string;
  text?: string;
  replies?: ReplyCommentProps[];
}

const ReplyComment: React.FC<ReplyCommentProps> = ({
  user_profile_picture_url,
  profile_picture,
  name,
  comment,
  text,
  tier_id,
  tier,
  created_at,
  replies = [],
}) => {
  return (
    <div className="flex gap-4 items-start">
      {" "}
      {/* Changed to items-start */}
      <div className="flex flex-col items-center">
        <Picture
          src={user_profile_picture_url || profile_picture || empty}
          alt="User Profile"
          size={36}
          rounded
        />
        <div className="h-full w-[1px] min-h-[40px] bg-gray-200"></div>{" "}
        {/* Replace SectionSeparator with custom divider */}
      </div>
      <div className=" flex-1 space-y-2">
        <div className="flex gap-2 items-center">
          <p className="text-text-primary text-sm font-medium capitalize pt-2">
            {name.toLocaleLowerCase()}
          </p>
          {tier && (
            <BadgeIcon color={getBadgeColor(Number(tier)) as BadgeIconColors} />
          )}
          {tier_id && (
            <BadgeIcon color={getBadgeColor(tier_id) as BadgeIconColors} />
          )}
        </div>

        <p className="text-text-disabled text-xs">{comment || text}</p>

        {replies.length > 0 && (
          <div className="ml-4">
            {replies.map((reply: ReplyCommentProps) => (
              <ReplyComment key={reply.id} {...reply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReplyComment;
