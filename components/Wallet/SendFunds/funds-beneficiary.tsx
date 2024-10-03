import React from "react";

// Types
import { FundsBeneficiaryProps } from "../types";

// Images
import { ChevronRight } from "lucide-react";
import Avatar4 from "@/public/empty/avatar-4.svg";

// Imports
import Picture from "@/components/Picture/picture";
import { SectionSeparator } from "@/components/Section/section-components";

const FundsBeneficiary: React.FC<FundsBeneficiaryProps> = ({ seeMore }) => {
  return (
    <div className="custom-flex-col gap-2">
      <button
        onClick={seeMore}
        className="text-start flex justify-between px-[18px]"
      >
        <div className="flex items-center gap-2">
          <Picture src={Avatar4} alt="profile picture" size={33} rounded />
          <div className="custom-flex-col font-medium">
            <p className="text-[#010A23] text-sm capitalize">David Ajala</p>
            <p className="text-[#606060] text-xs">Wallet ID: 1234567890</p>
          </div>
        </div>
        <button className="flex items-center">
          <ChevronRight size={20} color="#151515A6" />
        </button>
      </button>
      <SectionSeparator />
    </div>
  );
};

export default FundsBeneficiary;
