// Types
import type { CreateNewItemsProps } from "./types";

// Imports
import AddTenantModal from "../Management/Tenants/add-tenant-modal";
import AddLandlordModal from "../Management/Landlord/add-landlord-modal";
import AddPropertyModal from "../Management/Properties/add-property-modal";
import CreateReminderMOdal from "../tasks/calendars/create-reminder-modal";
// import CreateStaffModal from "../Management/Staff-And-Branches/create-staff-modal";
import CreateBranchModal from "../Management/Staff-And-Branches/create-branch-modal";
import NewDisbursementModal from "../Accounting/Disbursement/new-disbursement-modal";
// import CreateTenancyAggrementModal from "../BadgeIcon/create-tenancy-aggrement-modal";
import LegalProcedureModal from "../Documents/legal-procedure-modal";
import AddServiceProviderModal from "../tasks/service-providers/add-service-provider-modal";
import CreateExamineModal from "../tasks/Examine/create-examine-modal";

export const create_new_items: CreateNewItemsProps = [
  {
    type: "people",
    label: "management",
    content: [
      { label: "landlord / landlady", modal: <AddLandlordModal /> },
      { label: "tenants / occupants", modal: <AddTenantModal /> },
      { label: "branch", modal: <CreateBranchModal /> },
      //   { label: "staff", modal: <CreateStaffModal /> }, // NOTE: This modal require a branch id, thats why its commented out
      { label: "inventory", link: "/management/inventory/create-inventory" },
      { label: "property", modal: <AddPropertyModal /> },
    ],
  },
  {
    type: "briefcase_timer",
    label: "tasks",
    content: [
      { label: "examine", modal: <CreateExamineModal /> },
      { label: "maintenance", link: "/tasks/maintenance/create-new" },
      { label: "service provider", modal: <AddServiceProviderModal /> },
      { label: "event", modal: <CreateReminderMOdal /> },
      { label: "task", modal: <CreateReminderMOdal /> },
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
        modal: <LegalProcedureModal type="tenancy_agreement" title="Tenancy Agreement" />,
      },
      {
        label: "quit notice",
        modal: <LegalProcedureModal type="quit_notice" title="Quit Notice" />,
      },
      {
        label: "warning / reminder",
        modal: <LegalProcedureModal type="warning_reminder" title="Warning / Reminder" />,
      },
      {
        label: "court processs",
        modal: <LegalProcedureModal type="court_process" title="Court Process" />,
      },
      {
        label: "possession",
        modal: <LegalProcedureModal type="possession" title="Possession" />,
      },
      {
        label: "other legal processes",
        modal: <LegalProcedureModal type="other" title="Other Legal Processes" />,
      },
    ],
  },
];
