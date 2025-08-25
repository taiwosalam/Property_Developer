"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Imports
import SettingsLinkTab from "@/components/Settings/settings-link-tab";
import { settings_link_tabs } from "@/components/Settings/data";
import { SettingsProvider } from "@/hooks/settingsContext";

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  return (
    <SettingsProvider>
      <div className="custom-flex-col gap-10">
        <div className="flex overflow-x-auto gap-1 bg-neutral-2 dark:bg-[#3C3D37] pb-2 no-scrollbar">
          <div className="flex">
            {settings_link_tabs.map((tab) => (
              <SettingsLinkTab
                key={tab}
                type={tab}
                active={pathname.includes(tab)}
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
        <div className="relative z-[1] custom-flex-col p-3   gap-8 sm:p-6 rounded-2xl bg-white dark:bg-[#3C3D37]">
          {children}
        </div>
      </div>
    </SettingsProvider>
  );
};

export default SettingsLayout;
