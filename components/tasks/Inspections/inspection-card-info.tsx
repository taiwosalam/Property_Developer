import React from "react";

// Types
import type { InspectionCardInfoProps } from "./types";

// Images
import { LocationIcon } from "@/public/icons/icons";
import SampleProperty from "@/public/empty/SampleProperty.jpeg";

// Imports
import clsx from "clsx";
import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";

const InspectionCardInfo: React.FC<InspectionCardInfoProps> = ({
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-6 justify-between",
        className
      )}
    >
      <div className="flex items-center gap-4">
        <div className="relative rounded-[4px] overflow-hidden">
          <Picture
            src={SampleProperty}
            alt="preview"
            width={130}
            height={117}
          />
          <div className="absolute top-0 left-0 w-[120px] -rotate-45 -translate-x-[30px] translate-y-[20px] py-[2px] px-2 bg-status-error-2">
            <p className="text-text-invert text-xs font-semibold text-center">
              For Rent
            </p>
          </div>
        </div>
        <div className="custom-flex-col gap-1 text-text-secondary text-sm lg:text-base font-bold">
          <p>Newly Built 1 Bedroom</p>
          <p>Room and Parlour</p>
          <div className="text-text-disabled flex items-center gap-1">
            <LocationIcon />
            <p className="text-xs font-normal">
              Street 23, All Avenue, Nigeria
            </p>
          </div>
        </div>
      </div>
      <div className="custom-flex-col">
        <p
          className={`text-brand-primary text-lg md:text-xl lg:text-2xl font-bold ${secondaryFont.className}`}
        >
          ₦1,950,000
        </p>
        <p className="text-text-label text-xs font-semibold">Total Package</p>
        <p className="text-text-disabled text-sm font-medium">
          <span className="text-highlight">₦700,000</span> / Yearly
        </p>
      </div>
    </div>
  );
};

export default InspectionCardInfo;
