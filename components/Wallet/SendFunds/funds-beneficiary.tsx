"use client";

// Types
import { FundsBeneficiaryProps } from "../types";

// Images
import { ChevronRight } from "lucide-react";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { SectionSeparator } from "@/components/Section/section-components";
import useDarkMode from "@/hooks/useCheckDarkMode";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const FundsBeneficiary: React.FC<FundsBeneficiaryProps> = ({
  seeMore,
  remove,
  picture,
  name,
  wallet_id,
  badge_color,
  onClick,
}) => {
  const isDarkMode = useDarkMode();
  return (
    <div className="custom-flex-col gap-2">
      <div
        onClick={onClick}
        className="text-start flex justify-between px-[18px]"
        role={onClick ? "button" : undefined}
      >
        <div className="flex items-center gap-2">
          {picture && (
            <Picture src={picture} alt="profile picture" size={33} rounded />
          )}
          <div className="custom-flex-col font-medium">
            <div className="flex items-center">
              <p className="text-[#010A23] dark:text-white text-sm capitalize">
                {name}
              </p>
              {badge_color && <BadgeIcon color={badge_color} />}
            </div>
            <p className="text-[#606060] dark:text-darkText-1 text-xs">
              Wallet ID: {wallet_id}
            </p>
          </div>
        </div>
        <div className="flex items-center">
          {remove && (
            <Button size="xs_medium" className="py-1 px-2" onClick={remove}>
              remove
            </Button>
          )}
          {seeMore && (
            <ChevronRight
              size={20}
              color={isDarkMode ? "#EFF6FF" : "#151515A6"}
            />
          )}
        </div>
      </div>
      <SectionSeparator />
    </div>
  );
};

export default FundsBeneficiary;
