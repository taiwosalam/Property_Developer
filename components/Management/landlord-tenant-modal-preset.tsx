// Types
import type { LandlordTenantModalPresetProps } from "./types";

import { ModalTrigger } from "../Modal/modal";
import { ChevronLeft, DeleteIconX } from "@/public/icons/icons";
import { SectionSeparator } from "../Section/section-components";

const LandlordTenantModalPreset: React.FC<LandlordTenantModalPresetProps> = ({
  star,
  back,
  style,
  heading,
  children,
}) => {
  return (
    <div
      style={style}
      className="w-[900px] max-w-[80%] max-h-[90vh] rounded-[20px] bg-white dark:bg-black overflow-y-auto custom-round-scrollbar"
    >
      {/* Header */}
      <div className="sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[30px] bg-white dark:bg-darkText-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {back && (
              <button type="button" onClick={back.handleBack} aria-label="back">
                <ChevronLeft />
              </button>
            )}
            <p className="text-primary-navy dark:text-darkText-1 text-base md:text-lg lg:text-xl font-bold capitalize">
              {star && <span className="text-status-error-primary">*</span>}
              {heading}
            </p>
          </div>
          <ModalTrigger close className="p-2" type="button" aria-label="close">
            <DeleteIconX size={34} />
          </ModalTrigger>
        </div>
        <SectionSeparator className="!bg-[#B8B8B8]" />
      </div>

      {/* body */}
      <div className="px-[30px] pt-10 pb-[24px] md:pb-[32px]">{children}</div>
    </div>
  );
};

export default LandlordTenantModalPreset;
