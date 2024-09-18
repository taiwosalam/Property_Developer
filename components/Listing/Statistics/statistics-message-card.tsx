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

const StatisticsMessageCard: React.FC<StatisticsMessageCardProps> = ({
  type,
}) => {
  const isOffers = type === "offers";

  return (
    <div className="flex items-center gap-6">
      <div className="flex items-center gap-1">
        <Picture src={Avatar} alt="profile picture" size={40} rounded />
        <div className="custom-flex-col text-text-primary text-sm">
          <div className="flex items-center">
            <p className="font-bold">Salam AIshat</p>
            <BadgeIcon color="blue" />
          </div>
          {isOffers && (
            <p className="font-normal">
              Offering - <span className="text-success-2">#300,000</span>
            </p>
          )}
          <p
            className={clsx("text-xs custom-truncated", {
              "text-text-disabled font-normal": isOffers,
              "text-text-label font-medium": !isOffers,
            })}
          >
            3 Bedroom Bungalow Abiola Ibadan
          </p>
        </div>
      </div>
      <div
        className={clsx("flex gap-1 justify-between text-center text-[10px]", {
          "flex-col-reverse": isOffers,
          "flex-col": !isOffers,
        })}
      >
        <Button size="xs_bold" className="py-1 px-4 rounded-full">
          chat
        </Button>
        <p className="text-text-label font-normal">12/01/2024</p>
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
