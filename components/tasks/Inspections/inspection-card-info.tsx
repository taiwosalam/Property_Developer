import { useState } from "react";

// Types
import type { InspectionCardInfoProps } from "./types";

// Images
import { LocationIcon } from "@/public/icons/icons";
import SampleProperty from "@/public/empty/SampleProperty.jpeg";

// Imports
import clsx from "clsx";
import { secondaryFont } from "@/utils/fonts";
import Picture from "@/components/Picture/picture";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";

const InspectionCardInfo: React.FC<InspectionCardInfoProps> = ({
  className,
  image,
  title,
  total_price,
  address,
  yearly_price,
  unit_fee_period
}) => {
  const [screenModal, setScreenModal] = useState(false);
  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-6 justify-between",
        className
      )}
    >
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => {
          setScreenModal(false);
        }}
        images={[{ src: SampleProperty }]}
      />
      <div className="flex items-center gap-4">
        <div className="relative rounded-[4px] overflow-hidden">
          <Picture
            src={image ?? SampleProperty}
            alt="preview"
            width={130}
            height={117}
            onClick={() => setScreenModal(true)}
          />
          {/* <div className="absolute top-0 left-0 w-[120px] -rotate-45 -translate-x-[30px] translate-y-[20px] py-[2px] px-2 bg-status-error-2">
            <p className="text-text-invert dark:text-white text-xs font-semibold text-center">
              For Rent
            </p>
          </div> */}
        </div>
        <div className="custom-flex-col gap-1 text-text-secondary dark:text-white text-sm lg:text-base font-bold">
          <p>{ title }</p>
          
          <div className="text-text-disabled flex gap-1">
            <LocationIcon />
            <p className="text-xs font-normal max-w-[7.5rem]">
             { address}
            </p>
          </div>
        </div>
      </div>
      <div className="custom-flex-col">
        <p
          className={`text-brand-primary text-lg md:text-xl lg:text-2xl font-bold ${secondaryFont.className}`}
        >
          {total_price}
        </p>
        <p className="text-text-label dark:text-darkText-1 text-xs font-semibold">
          Total Package
        </p>
        <p className="text-text-disabled text-sm font-medium">
         { yearly_price && <span className="text-highlight">{yearly_price } / Yearly</span> }
        </p>
      </div>
    </div>
  );
};

export default InspectionCardInfo;
