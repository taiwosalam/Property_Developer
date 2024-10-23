"use client"
import React from "react";

// Types
import { FundsBeneficiaryProps } from "../types";

// Images
import { ChevronRight } from "lucide-react";
import Avatar4 from "@/public/empty/avatar-4.svg";

// Imports
import clsx from "clsx";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import { SectionSeparator } from "@/components/Section/section-components";
import useDarkMode from "@/hooks/useCheckDarkMode";

const FundsBeneficiary: React.FC<FundsBeneficiaryProps> = ({
  seeMore,
  remove,
}) => {
  const isDarkMode = useDarkMode()
  return (
    <div className="custom-flex-col gap-2">
      <button
        onClick={seeMore}
        className={clsx("text-start flex justify-between px-[18px]", {
          "cursor-default": !seeMore,
        })}
      >
        <div className="flex items-center gap-2">
          <Picture src={Avatar4} alt="profile picture" size={33} rounded />
          <div className="custom-flex-col font-medium">
            <p className="text-[#010A23] dark:text-white text-sm capitalize">David Ajala</p>
            <p className="text-[#606060] dark:text-darkText-1 text-xs">Wallet ID: 1234567890</p>
          </div>
        </div>
        <div className="flex items-center">
          {remove && (
            <Button size="xs_medium" className="py-1 px-2">
              remove
            </Button>
          )}
          {seeMore && <ChevronRight size={20} color={isDarkMode ? "#EFF6FF" : "#151515A6"} />}
        </div>
      </button>
      <SectionSeparator />
    </div>
  );
};

export default FundsBeneficiary;
