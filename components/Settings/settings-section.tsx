"use client";
import React, { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(true);

  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className="bg-white dark:bg-darkText-primary rounded-2xl custom-flex-col"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex justify-between py-[18px] px-6 bg-neutral-2 dark:bg-black rounded-t-2xl">
        <div className="content flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <p className="text-primary-navy dark:text-white text-base font-medium capitalize">
            {title}
          </p>
          {subTitle && (
            <p className="text-text-tertiary dark:text-white text-xs font-normal">
              {subTitle}
            </p>
          )}
        </div>
        <button onClick={toggleContent}>
          <Picture
            src={SettingsArrowDown}
            size={18}
            className={`transform transition-transform duration-300 ${
              isOpen ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>
      {isOpen && <div className="p-6">{children}</div>}
    </div>
  );
};

export default SettingsSection;
