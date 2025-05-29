import { useGlobalStore } from "@/store/general-store";
import { dashboardSteps } from "./dashboard-steps";
import { propertiesSteps, welcomeStep } from "./properties-step";
import { TourStep } from "../types";
import { navSteps } from "./nav-steps";

export interface PageTourConfig {
  steps: TourStep[];
  tourKey: string;
  condition?: () => boolean;
}


export const pageSteps: Record<string, PageTourConfig> = {
  "/": {
    steps: [...navSteps, ...dashboardSteps],
    tourKey: "NavTour",
  },
  // "/dashboard": {
  //   steps: dashboardSteps,
  //   tourKey: "DashboardTour",
  // },
  "/properties": {
    steps: propertiesSteps,
    tourKey: "PropertiesTour",
    condition: () => {
      const properties = useGlobalStore
        .getState()
        .getGlobalInfoStore("managementProperties");
      return !properties || properties.length === 0;
    },
  },
  "/management/properties": {
    steps: propertiesSteps,
    tourKey: "PropertiesTour",
    condition: () => {
      const properties = useGlobalStore
        .getState()
        .getGlobalInfoStore("managementProperties");
      return !properties || properties.length === 0;
    },
  },
};

// Helper to prepend welcomeStep
export const getTourStepsWithWelcome = (config: PageTourConfig): TourStep[] => {
  return [...config.steps];
};
