import React from "react";

// Types
import type { SettingsSectionProps } from "./types";

// Images
import SettingsArrowDown from "@/public/icons/settings-arrow-down.png";
import Picture from "../Picture/picture";

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
}) => {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden custom-flex-col"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex justify-between py-[18px] px-6 bg-neutral-2">
        <p className="text-primary-navy text-base font-medium capitalize">
          {title}
        </p>
        <button>
          <Picture src={SettingsArrowDown} size={18} />
        </button>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default SettingsSection;
