// Types
import type { CreateNewItemsProps } from "./types";

// Imports
import AddTenantModal from "../Management/Tenants/add-tenant-modal";
import AddLandlordModal from "../Management/Landlord/add-landlord-modal";
// import AddPropertyModal from "../Management/Properties/add-property-modal";
import CreateReminderMOdal from "../tasks/calendars/create-reminder-modal";
// import CreateStaffModal from "../Management/Staff-And-Branches/create-staff-modal";
import CreateBranchModal from "../Management/Staff-And-Branches/create-branch-modal";
import NewDisbursementModal from "../Accounting/Disbursement/new-disbursement-modal";
// import CreateTenancyAggrementModal from "../BadgeIcon/create-tenancy-aggrement-modal";
import LegalProcedureModal from "../Documents/legal-procedure-modal";
import CreateExamineModal from "../tasks/Examine/create-examine-modal";
import AddServiceProviderModal from "../tasks/service-providers/add-service-provider-modal";
import CreateTenancyAggrementModal from "../BadgeIcon/create-tenancy-aggrement-modal";
import dynamic from "next/dynamic";

const AddPropertyModal = dynamic(
  () => import("@/components/Management/Properties/add-property-modal"),
  { ssr: false }
);

export const create_new_items: CreateNewItemsProps = [
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord / landlady", modal: <AddLandlordModal /> },
      { label: "tenants / occupants", modal: <AddTenantModal /> },
      { label: "branch", modal: <CreateBranchModal /> },
      //   { label: "staff", modal: <CreateStaffModal /> }, // NOTE: This modal require a branch id, thats why its commented out
      // { label: "inventory", link: "/management/inventory/create-inventory" },
      { label: "property", modal: <AddPropertyModal /> },
      { label: "service provider", modal: <AddServiceProviderModal /> },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "examine", modal: <CreateExamineModal /> },
      { label: "maintenance", link: "/tasks/maintenance/create-new" },
      // { label: "event", modal: <CreateReminderMOdal /> },
      // { label: "task", modal: <CreateReminderMOdal /> },
      { label: "reminder", modal: <CreateReminderMOdal /> },
      {
        label: "announcement",
        link: "/tasks/announcements/create-announcement",
      },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    content: [
      { label: "invoice", link: "/accounting/invoice/create-invoice" },
      { label: "expenses", link: "/accounting/expenses/create-expenses" },
      { label: "disbursement", modal: <NewDisbursementModal /> },
    ],
  },
  {
    type: "folder",
    label: "documents",
    content: [
      {
        label: "tenancy agreement",
        modal: (
          <CreateTenancyAggrementModal defaultOption="tenancy_agreement" />
        ),
      },
      {
        label: "other documents",
        modal: <CreateTenancyAggrementModal defaultOption="other_document" />,
      },
      // {
      //   label: "quit notice",
      //   modal: <LegalProcedureModal type="quit_notice" title="Quit Notice" />,
      // },
      // {
      //   label: "warning / reminder",
      //   modal: (
      //     <LegalProcedureModal
      //       type="warning_reminder"
      //       title="Warning / Reminder"
      //     />
      //   ),
      // },
      // {
      //   label: "court processs",
      //   modal: (
      //     <LegalProcedureModal type="court_process" title="Court Process" />
      //   ),
      // },
      // {
      //   label: "possession",
      //   modal: <LegalProcedureModal type="possession" title="Possession" />,
      // },
    ],
  },
];

export const manager_create_new_items: CreateNewItemsProps = [
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord / landlady", modal: <AddLandlordModal /> },
      { label: "tenants / occupants", modal: <AddTenantModal /> },
      { label: "property", modal: <AddPropertyModal /> },
      { label: "service provider", modal: <AddServiceProviderModal /> },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "examine", modal: <CreateExamineModal /> },
      { label: "maintenance", link: "/manager/tasks/maintenance/create-new" },
      { label: "reminder", modal: <CreateReminderMOdal /> },
      {
        label: "announcement",
        link: "/manager/tasks/announcements/create-announcement",
      },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    content: [
      { label: "invoice", link: "/manager/accounting/invoice/create-invoice" },
      {
        label: "expenses",
        link: "/manager/accounting/expenses/create-expenses",
      },
      { label: "disbursement", modal: <NewDisbursementModal /> },
    ],
  },
  {
    type: "folder",
    label: "documents",
    content: [
      {
        label: "tenancy agreement",
        modal: (
          <CreateTenancyAggrementModal defaultOption="tenancy_agreement" />
        ),
      },
      {
        label: "other documents",
        modal: <CreateTenancyAggrementModal defaultOption="other_document" />,
      },
    ],
  },
];

export const accountant_create_new_items: CreateNewItemsProps = [
  {
    type: "people",
    label: "management",
    content: [{ label: "property", modal: <AddPropertyModal /> }],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "examine", modal: <CreateExamineModal /> },
      {
        label: "announcement",
        link: "/accountant/tasks/announcements/create-announcement",
      },
    ],
  },
  {
    type: "menu_board",
    label: "accounting",
    content: [
      {
        label: "invoice",
        link: "/accountant/accounting/invoice/create-invoice",
      },
      {
        label: "expenses",
        link: "/accountant/accounting/expenses/create-expenses",
      },
    ],
  },
  {
    type: "folder",
    label: "documents",
    content: [
      {
        label: "Tenancy Form",
        modal: (
          <CreateTenancyAggrementModal defaultOption="tenancy_application_form" />
        ),
      },
      {
        label: "Management Form",
        modal: (
          <CreateTenancyAggrementModal defaultOption="management_application_form" />
        ),
      },
    ],
  },
];

export const staff_create_new_items: CreateNewItemsProps = [
  {
    type: "people",
    label: "management",
    content: [{ label: "property", modal: <AddPropertyModal /> }],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "examine", modal: <CreateExamineModal /> },
      {
        label: "announcement",
        link: "/accountant/tasks/announcements/create-announcement",
      },
    ],
  },
  {
    type: "folder",
    label: "documents",
    content: [
      {
        label: "Tenancy Form",
        modal: (
          <CreateTenancyAggrementModal defaultOption="tenancy_application_form" />
        ),
      },
      {
        label: "Management Form",
        modal: (
          <CreateTenancyAggrementModal defaultOption="management_application_form" />
        ),
      },
    ],
  },
];

// Array of labels for features that are not yet available
export const unavailableFeatures = [
  "task",
  "event",
  "reminder",
  "announcement",
  "examine",
  "maintenance",
  "announcement",
  "quit notice",
];

// ========== PERMISSION CHECK  ==========
export const permissionMapping: Record<
  string,
  { permission: string; ownerRoles: string[] }
> = {
  "landlord / landlady": {
    permission: "Can add and manage landlords/landlady",
    ownerRoles: ["manager", "account"],
  },
  "tenants / occupants": {
    permission: "Can add and manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  branch: {
    permission: "Can add/delete branch properties",
    ownerRoles: ["manager", "account"],
  },
  property: {
    permission: "Can add/delete branch properties",
    ownerRoles: ["manager", "account", "staff"],
  },
  "service provider": {
    permission: "Can create service provider",
    ownerRoles: ["manager"],
  },
  examine: {
    permission: "Can create examine",
    ownerRoles: ["manager", "account", "staff"],
  },
  maintenance: {
    permission: "Can manage inspections",
    ownerRoles: ["manager", "account", "staff"],
  },
  reminder: {
    permission: "Can manage calendar",
    ownerRoles: ["manager", "account", "staff"],
  },
  announcement: {
    permission: "Can create and manage announcement",
    ownerRoles: ["manager", "account"],
  },
  invoice: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["account"],
  },
  expenses: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["account"],
  },
  disbursement: {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["account"],
  },
  "tenancy agreement": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  "other documents": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["manager", "account"],
  },
  "tenancy form": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["staff"],
  },
  "management form": {
    permission: "Can manage tenants/occupants",
    ownerRoles: ["staff"],
  },
};
