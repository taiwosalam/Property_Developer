import React from "react";
import Image from "next/image";
import Picture from "../Picture/picture";
import { empty } from "@/app/config";
import useFetch from "@/hooks/useFetch";
import { UserDetailsResponse } from "./types";
import { getCleanRoleName } from "./data";
import BadgeIcon, { tierColorMap } from "../BadgeIcon/badge-icon";
import { capitalizeWords } from "@/hooks/capitalize-words";

interface CardProps {
  id: number;
  imageUrl: string;
  name: string;
  position: string;
  status: string;
  title: string;
  tier: number;
}

const positionMap: Record<string, string> = {
  manager: "Branch Manager",
  director: "Director",
  staff: "Staff",
  account: "Account Officer",
};

const MessageUserCard = ({
  imageUrl,
  name,
  position,
  status,
  id,
  title,
  tier,
}: CardProps) => {
  const isAcct =
    position === "director" ||
    position === "manager" ||
    position === "staff" ||
    position === "account";
  const showActBadge = isAcct && tier === 2;

  const isRoleThatShouldGrayBadge = [
    "director",
    "manager",
    "staff",
    "account",
  ].includes(position);
  const isGrayBadge = tier === 2 && isRoleThatShouldGrayBadge;

  const badgeColor = isGrayBadge
    ? "gray"
    : tierColorMap[tier as keyof typeof tierColorMap] || undefined;

  const displayPosition = positionMap[position.toLowerCase()] || position;
  const isOnline = status?.toLowerCase() === "online";

  return (
    <div className="flex items-center gap-4 mt-4">
      <Picture
        src={imageUrl || empty}
        alt="profile picture"
        containerClassName="custom-secondary-bg rounded-full"
        size={60}
        rounded
        status={isOnline}
      />
      <div className="flex flex-col">
        <div className="flex items-centerr">
          <p className="text-text-primary dark:text-white text-lg font-medium capitalize">
            {capitalizeWords(title)} {capitalizeWords(name)}
          </p>
          {showActBadge ? (
            <BadgeIcon color="gray" />
          ) : !isAcct ? (
            <BadgeIcon color={badgeColor} />
          ) : null}
        </div>
        <p className="text-text-quaternary dark:text-text-disabled text-xs font-normal capitalize">
          {displayPosition}
        </p>
      </div>
    </div>
  );
};

export default MessageUserCard;
