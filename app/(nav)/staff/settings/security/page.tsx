"use client";

import React from "react";

// Imports
import SettingsPasswordSection from "@/components/Settings/settings-password-section";
import ManagerProfile from "@/components/Settings/settingsBranchManager";

const Security = () => {
  return (
    <>
      <ManagerProfile />
      <SettingsPasswordSection />
    </>
  );
};

export default Security;
