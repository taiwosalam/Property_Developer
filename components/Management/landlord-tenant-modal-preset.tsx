// Types
import type { LandlordTenantModalPresetProps } from "./types";
import { ModalTrigger } from "../Modal/modal";
import { ChevronLeft, NavCloseIcon } from "@/public/icons/icons";
import { SectionSeparator } from "../Section/section-components";

const LandlordTenantModalPreset: React.FC<LandlordTenantModalPresetProps> = ({
  star,
  back,
  style,
  heading,
  children,
  className,
  lightSeparator,
  bodyStyle,
  noPaddingTop = false,
  customClose,
}) => {
  return (
    <div
      style={style}
      className={`w-[85%] max-w-[900px] max-h-[90vh] rounded-[20px] bg-white dark:bg-black overflow-auto custom-round-scrollbar ${className}`}
    >
      {/* Header */}
      <div className="sticky z-[1] top-0 px-[30px] pt-[12px] md:pt-[20px] bg-white dark:bg-darkText-primary rounded-t-[20px]">
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
          {!customClose ? (
            <ModalTrigger close className="p-2" aria-label="close">
              <NavCloseIcon />
            </ModalTrigger>
          ) : (
            <button onClick={customClose}>
              <NavCloseIcon />
            </button>
          )}
        </div>
        <SectionSeparator className={!lightSeparator ? "!bg-[#B8B8B8]" : ""} />
      </div>

      {/* body */}
      <div
        className={`px-[30px] ${
          noPaddingTop ? "pt-0" : "pt-10"
        } pb-[24px] md:pb-[32px]`}
        style={bodyStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default LandlordTenantModalPreset;
