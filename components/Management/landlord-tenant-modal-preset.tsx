import React from "react";

// Types
import type { LandlordTenantModalPresetProps } from "./types";

// Images
import CloseCircle from "@/public/icons/close-circle.svg";
import ChevronLeft from "@/public/icons/chevron-left.svg";

// Imports
import Picture from "../Picture/picture";
import { ModalTrigger } from "../Modal/modal";

const LandlordTenantModalPreset: React.FC<LandlordTenantModalPresetProps> = ({
  back,
  heading,
  children,
}) => {
  return (
    <div className="w-[900px] max-w-[80%] max-h-[85%] rounded-[20px] bg-white overflow-x-auto custom-round-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-solid border-[#B8B8B8] sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white">
        <div className="flex items-center gap-2">
          {back && (
            <button type="button" onClick={back.handleBack}>
              <Picture src={ChevronLeft} alt="back" size={24} />
            </button>
          )}
          <p className="text-primary-navy text-base md:text-lg lg:text-xl font-bold capitalize">
            {heading}
          </p>
        </div>
        <ModalTrigger close className="p-2" type="button">
          <Picture src={CloseCircle} alt="close" size={34} />
        </ModalTrigger>
      </div>
      {/* body */}
      <div className="px-[30px] pt-10 pb-[24px] md:pb-[36px]">{children}</div>
    </div>
  );
};

export default LandlordTenantModalPreset;
