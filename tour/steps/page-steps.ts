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
import { addUnitSteps } from "./add-unit-steps";
import { setupSteps } from "./setup-steps";
import { editPropertySteps } from "./manage-facility";
import { createFacilitySteps } from "./create-facility";
import { addFacilityUnit } from "./facility-add-unit";
import { branchManagementSteps } from "./branch-step";
import { editBranchSteps } from "./edit-branch-steps";
import { createInvoiceSteps } from "./create-invoice-steps";
import { createDisbursementSteps } from "./create-disburstment";
import { editStaffSteps } from "./edit-staff-steps";
import { editLandlordSteps } from "./edit-landlord-steps";
import { editTenantSteps } from "./edit-tenants-steps";
import { createAnnouncementSteps } from "./create-announcement";
import { createAgentContributionSteps } from "./create-agent-forum";
import { createTenancyAgreementSteps } from "./create-document";
import { createPropertyRequestSteps } from "./property-request-steps";
import { createExpensesSteps } from "./create-expenses";
import { createInventorySteps } from "./create-inventory-steps";

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
  "/management/properties/create-rental-property/add-unit": {
    steps: addUnitSteps,
    tourKey: "AddUnitTour",
    match: (pathname: string) =>
      /^\/management\/properties\/create-rental-property\/[^\/]+\/add-unit$/.test(
        pathname
      ),
  },
  "/management/properties/edit-property": {
    steps: editPropertySteps,
    tourKey: "EditPropertyTour",
    match: (pathname: string) =>
      /^\/management\/properties\/[^\/]+\/edit-property$/.test(pathname),
  },
  "/management/properties/create-gated-estate-property": {
    steps: createFacilitySteps,
    tourKey: "CreateGatedEstatePropertyTour",
    match: (pathname: string) =>
      pathname === "/management/properties/create-gated-estate-property",
  },
  "/management/properties/create-gated-estate-property/add-unit": {
    steps: addFacilityUnit,
    tourKey: "AddGatedEstateUnitTour",
    match: (pathname: string) =>
      /^\/management\/properties\/create-gated-estate-property\/[^\/]+\/add-unit$/.test(
        pathname
      ),
  },
  "/management/staff-branch": {
    steps: branchManagementSteps,
    tourKey: "branchDetailsTour",
    //  condition: () => {
    //   const tenants = useGlobalStore.getState().getGlobalInfoStore("bra");
    //   return !tenants || tenants.length === 0;
    // },
    match: (pathname: string) =>
      /^\/management\/staff-branch\/[^\/]+$/.test(pathname),
  },
  "/management/staff-branch/edit-branch": {
    steps: editBranchSteps,
    tourKey: "EditBranchTour",
    match: (pathname: string) =>
      /^\/management\/staff-branch\/[^\/]+\/edit-branch$/.test(pathname),
  },
  "/accounting/invoice/create-invoice": {
    steps: createInvoiceSteps,
    tourKey: "CreateInvoiceTour",
    match: (pathname: string) =>
      pathname === "/accounting/invoice/create-invoice",
  },
  "/accounting/disbursement/create-disbursement": {
    steps: createDisbursementSteps,
    tourKey: "CreateDisbursementTour",
    match: (pathname: string) =>
      pathname === "/accounting/disbursement/create-disbursement",
  },
  "/management/staff-branch/branch-staff/edit": {
    steps: editStaffSteps,
    tourKey: "EditStaffTour",
    match: (pathname: string) =>
      /^\/management\/staff-branch\/[^\/]+\/branch-staff\/[^\/]+\/edit$/.test(
        pathname
      ),
  },
  "/management/landlord/manage/edit": {
    steps: editLandlordSteps,
    tourKey: "EditLandlordTour",
    match: (pathname: string) =>
      /^\/management\/landlord\/[^\/]+\/manage\/edit$/.test(pathname),
  },

  "/management/tenants/manage/edit": {
    steps: editTenantSteps,
    tourKey: "EditTenantTour",
    match: (pathname: string) =>
      /^\/management\/tenants\/[^\/]+\/manage\/edit$/.test(pathname),
  },
  "/tasks/announcements/create-announcement": {
    steps: createAnnouncementSteps,
    tourKey: "CreateAnnouncementTour",
    match: (pathname: string) =>
      pathname === "/tasks/announcements/create-announcement",
  },
  "/community/agent-forum/my-articles/create": {
    steps: createAgentContributionSteps,
    tourKey: "CreateAgentContributionTour",
    match: (pathname: string) =>
      pathname === "/community/agent-forum/my-articles/create",
  },
  "/documents/create-tenancy-agreement": {
    steps: createTenancyAgreementSteps,
    tourKey: "CreateTenancyAgreementTour",
    match: (pathname: string) =>
      /^\/documents\/create-tenancy-agreement(\?p=\d+)?$/.test(pathname),
  },
  "/community/agent-request/my-properties-request/create": {
    steps: createPropertyRequestSteps,
    tourKey: "CreatePropertyRequestTour",
    match: (pathname: string) =>
      pathname === "/community/agent-request/my-properties-request/create",
  },
   "/accounting/expenses/create-expenses": {
    steps: createExpensesSteps,
    tourKey: "CreateExpensesTour",
    match: (pathname: string) => pathname === "/accounting/expenses/create-expenses",
  },
   "/management/inventory/:propertyId/create-inventory": {
    steps: createInventorySteps,
    tourKey: "CreateInventoryTour",
    match: (pathname: string) =>
      /^\/management\/inventory\/[^\/]+\/create-inventory(\?unitId=\d+)?$/.test(pathname),
  },
  "/management/inventory/:inventoryId/manage": {
    steps: createInventorySteps,
    tourKey: "ManageInventoryTour",
    match: (pathname: string) =>
      /^\/management\/inventory\/[^\/]+\/manage(\?inventoryId=\d+&propertyId=\d+)?$/.test(pathname),
  },

  "/setup": {
    steps: setupSteps,
    tourKey: "SetupTour",
    match: (pathname: string) => pathname === "/setup",
  },
};

export const getTourStepsWithWelcome = (config: PageTourConfig): TourStep[] => {
  return [...config.steps];
};
