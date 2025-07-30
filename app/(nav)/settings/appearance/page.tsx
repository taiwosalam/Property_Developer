"use client";
import { useEffect, useState } from "react";
import useDarkMode from "@/hooks/useCheckDarkMode";
import { useSettings } from "@/hooks/settingsContext";
import { transformData } from "./data";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import DashboardThemes from "@/components/Settings/Appearance/dashboard-themes";
import GridListSettings from "@/components/Settings/Appearance/grid-list-settings";
import NavbarSettings from "@/components/Settings/Appearance/navbar-settings";
import ModeSettings from "@/components/Settings/Appearance/mode-settings";
import FontAndColorSettings from "@/components/Settings/Appearance/font-color-settings";

// Main Appearance Page
const Appearance = () => {
  const isDarkMode = useDarkMode();
  const currentPlan = usePersonalInfoStore((state) => state.currentPlan);
  const currentPlanKeyword = currentPlan?.split(" ")[0]?.toLowerCase();
  const { data, isLoading } = useSettings();
  const defaultAppearance = {
    theme: "",
    view: "",
    navbar: "",
    mode: "",
    font: "",
    color: "",
    zoom: "",
  };

  const [appearance, setAppearance] = useState(defaultAppearance);

  useEffect(() => {
    if (data) {
      setAppearance((x) => ({ ...x, ...transformData(data) }));
    }
  }, [data]);

  // Loading spinner
  if (isLoading) return <PageCircleLoader />;

  return (
    <>
      <DashboardThemes
        appearance={appearance}
        setAppearance={setAppearance}
        currentPlanKeyword={currentPlanKeyword}
      />
      <GridListSettings appearance={appearance} setAppearance={setAppearance} />
      <NavbarSettings appearance={appearance} setAppearance={setAppearance} />
      <ModeSettings appearance={appearance} setAppearance={setAppearance} />
      <FontAndColorSettings
        appearance={appearance}
        setAppearance={setAppearance}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default Appearance;
