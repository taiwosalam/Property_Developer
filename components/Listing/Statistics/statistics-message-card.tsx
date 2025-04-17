import React from "react";

// Types
import type { StatisticsMessageCardProps } from "./types";

// Images
import Avatar from "@/public/empty/avatar-3.svg";

// Imports
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import Button from "@/components/Form/Button/button";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const mapTierToColor = (
  tier: number
): "red" | "green" | "black" | "blue" | "yellow" | "gray" | "purple" => {
  const tierColorMap: Record<
    number,
    "red" | "green" | "black" | "blue" | "yellow" | "gray" | "purple"
  > = {
    1: "red",
    2: "green",
    3: "blue",
    4: "yellow",
    5: "gray",
    6: "purple",
    7: "black",
  };
  return tierColorMap[tier] || "gray"; // Default to "gray" if tier is not mapped
};

const StatisticsMessageCard: React.FC<StatisticsMessageCardProps> = ({
  type,
  user,
}) => {
  const isOffers = false; //Note: This was removed: type === "offers"

  const formattedDate = user ?  new Date(user.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }): "";

  const router = useRouter();
  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-1">
        <Picture
          src={user?.photo ?? Avatar}
          alt="profile picture"
          size={40}
          rounded
          className="bg-blue-400"
        />
        <div className="custom-flex-col text-text-primary dark:text-darkText-1 text-sm">
          <div className="flex items-center">
            <p className="font-bold">{user?.name ?? "___ ___"}</p>
            <BadgeIcon color={mapTierToColor(user?.tier ?? 0)} />
          </div>
          {isOffers && (
            <p className="font-normal">
              Offering - <span className="text-status-success-2">#300,000</span>
            </p>
          )}
          <p
            className={clsx("text-xs custom-truncated", {
              "text-text-disabled font-normal": isOffers,
              "text-text-label font-medium": !isOffers,
            })}
          >
            {user?.unit_name ?? "___ ___"}
          </p>
        </div>
      </div>
      <div
        className={clsx("flex gap-1 justify-between text-center text-[10px]", {
          "flex-col-reverse": isOffers,
          "flex-col": !isOffers,
        })}
      >
        <Button size="xs_bold" className="py-1 px-4 rounded-full" onClick={() => router.push('/message')}>
          chat
        </Button>
        <p className="text-text-label font-normal">{formattedDate ?? "___ ___"}</p>
        {isOffers && (
          <p className="capitalize font-medium text-status-success-primary">
            accepted
          </p>
        )}
      </div>
    </div>
  );
};

export default StatisticsMessageCard;
