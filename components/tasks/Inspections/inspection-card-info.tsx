import { useState } from "react";

// Types
import type { InspectionCardInfoProps } from "./types";

// Images
import { CameraIcon, LocationIcon } from "@/public/icons/icons";
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
  unit_fee_period,
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
        images={image}
      />
      <div className="flex gap-4">
        <div className="relative rounded-[4px] overflow-hidden min-w-[130px]">
          <Picture
            src={image[0]?.src ?? SampleProperty}
            alt="preview"
            width={130}
            height={117}
            onClick={() => setScreenModal(true)}
          />
          <div className="absolute top-0 left-0 py-[2px] px-2">
            {image.length && (
              <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon />
                <p className="text-black dark:text-darkText-1 font-medium text-[10px]">
                  +{image.length}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="pr-4 custom-flex-col gap-1 text-text-secondary dark:text-white text-sm lg:text-base font-bold capitalize max-w-[500px] min-w-0 overflow-hidden break-words">
          <p className="break-words whitespace-normal">
            {title}
          </p>

          <div className="text-text-disabled flex gap-1 min-w-0  max-w-full">
            <LocationIcon />
            <p className="text-xs font-normal w-full break-words whitespace-normal line-clamp-3">
              {address}
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
          {yearly_price && (
            <span className="text-highlight">{yearly_price} / Yearly</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default InspectionCardInfo;
