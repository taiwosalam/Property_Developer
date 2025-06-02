import { useGlobalStore } from "@/store/general-store";
import { dashboardSteps } from "./dashboard-steps";
import { propertiesSteps } from "./properties-step";
import { TourStep } from "../types";
import { navSteps } from "./nav-steps";
import { startRentSteps } from "./start-rent-steps";
import { editRentSteps } from "./edit-rent";
import { selectUnitRentSteps } from "./select-unit-steps";
import { renewRentSteps } from "./renew-steps";
import { createPropertySteps } from "./create-property";

export interface PageTourConfig {
  steps: TourStep[];
  tourKey: string;
  condition?: () => boolean;
  match?: (pathname: string) => boolean; // Add match function for dynamic routes
}

export const pageSteps: Record<string, PageTourConfig> = {
  "/dashboard": {
    steps: [...navSteps, ...dashboardSteps],
    tourKey: "DashboardTour",
    match: (pathname: string) => pathname === "/dashboard",
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
    match: (pathname: string) => pathname === "/management/properties",
  },
  "/management/rent-unit/start-rent": {
    steps: startRentSteps,
    tourKey: "StartRentTour",
    match: (pathname: string) =>
      /^\/management\/rent-unit\/[^\/]+\/start-rent$/.test(pathname),
  },
  "/management/rent-unit/edit-rent": {
    steps: editRentSteps,
    tourKey: "EditRentTour",
    match: (pathname: string) =>
      /^\/management\/rent-unit\/[^\/]+\/edit-rent$/.test(pathname),
  },
  "/management/rent-unit/edit-rent/select-unit": {
    steps: selectUnitRentSteps,
    tourKey: "PostProceedUnitTour",
    match: (pathname: string) =>
      /^\/management\/rent-unit\/[^\/]+\/edit-rent\/select-unit$/.test(
        pathname
      ) && !pathname.includes("step1Done"),
  },
  "/management/rent-unit/edit-rent/change-property": {
    steps: selectUnitRentSteps,
    tourKey: "PostProceedUnitTour",
    match: (pathname: string) =>
      /^\/management\/rent-unit\/[^\/]+\/edit-rent\/change-property$/.test(
        pathname
      ),
  },
  "/management/rent-unit/renew-rent": {
    steps: renewRentSteps,
    tourKey: "RenewRentTour",
    match: (pathname: string) =>
      /^\/management\/rent-unit\/[^\/]+\/renew-rent$/.test(pathname),
  },
  "/management/properties/create-rental-property": {
    steps: createPropertySteps,
    tourKey: "CreatePropertyTour",
    match: (pathname: string) =>
      pathname === "/management/properties/create-rental-property",
  },
};

export const getTourStepsWithWelcome = (config: PageTourConfig): TourStep[] => {
  return [...config.steps];
};
