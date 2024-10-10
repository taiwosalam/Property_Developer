import React from "react";

// Types
import type { SettingsSectionProps } from "./types";

// Images
import SettingsArrowDown from "@/public/icons/settings-arrow-down.png";
import Picture from "../Picture/picture";

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  subTitle,
  children,
}) => {
  return (
    <div
      className="bg-white rounded-2xl custom-flex-col"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex justify-between py-[18px] px-6 bg-neutral-2">
        <div className="flex items-center gap-2">
          <p className="text-primary-navy text-base font-medium capitalize">
            {title}
          </p>
          {subTitle && (
            <p className="text-text-tertiary text-xs font-normal">{subTitle}</p>
          )}
        </div>
        <button>
          <Picture src={SettingsArrowDown} size={18} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default SettingsSection;
