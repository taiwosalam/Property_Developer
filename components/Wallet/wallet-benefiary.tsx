import React from "react";

// Images
import Avatar4 from "@/public/empty/avatar-4.svg";

// Imports
import Picture from "../Picture/picture";
import { secondaryFont } from "@/utils/fonts";
import { SectionSeparator } from "../Section/section-components";

const WalletBenefiary = () => {
  return (
    <div className="custom-flex-col gap-2">
      <div className="flex items-center gap-2">
        <Picture src={Avatar4} alt="profile picture" size={33} />
        <div className={`custom-flex-col ${secondaryFont.className}`}>
          <p className="text-text-primary text-base font-medium capitalize">
            David Ajala
          </p>
          <p className="text-text-label text-xs font-normal">
            Wallet ID: 1234567890
          </p>
        </div>
      </div>
      <SectionSeparator />
    </div>
  );
};

export default WalletBenefiary;
