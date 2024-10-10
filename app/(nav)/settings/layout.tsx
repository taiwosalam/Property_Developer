import React from "react";

// Imports
import SettingsLinkTab from "@/components/Settings/settings-link-tab";

const SettingsLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="custom-flex-col gap-10">
      <div className="flex gap-1">
        <SettingsLinkTab active type="profile" />
        <SettingsLinkTab type="management" />
        <SettingsLinkTab type="subscription" />
        <SettingsLinkTab type="services" />
        <SettingsLinkTab type="security" />
        <SettingsLinkTab type="enrollment" />
        <SettingsLinkTab type="appearance" />
        <SettingsLinkTab type="others" />
      </div>
      <div className="custom-flex-col gap-8 p-6 rounded-2xl bg-white">
        {children}
      </div>
    </div>
  );
};

export default SettingsLayout;
