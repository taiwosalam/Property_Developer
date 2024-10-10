"use client";

import React from "react";
import { usePathname } from "next/navigation";

// Imports
import SettingsLinkTab from "@/components/Settings/settings-link-tab";
import { settings_link_tabs } from "@/components/Settings/data";

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();

  return (
    <div className="custom-flex-col gap-10">
      <div className="sticky top-[150px] z-[2] flex gap-1 bg-neutral-2 pb-2">
        {settings_link_tabs.map((tab) => (
          <SettingsLinkTab
            key={tab}
            type={tab}
            active={pathname.includes(tab)}
          />
        ))}
      </div>
      <div className="relative z-[1] custom-flex-col gap-8 p-6 rounded-2xl bg-white">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
