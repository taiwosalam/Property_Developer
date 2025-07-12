
import { TourStep } from "../types";

export const editBranchSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Edit Branch Details",
    content:
      "This section allows you to update and manage key information about your branch, including the branch name, address, contact details, and other essential settings.\n\nNeed to make changes? You're in the right place.\nAlready know your way around? You can skip the tour at any time.",
  },
  {
    target: ".lock-branch-button",
    placement: "left",
    title: "Lock Branch",
    content:
      "Click this button to lock the branch, restricting branch staff from logging in or performing key operations such as wallet transactions, staff management, or property-related activities.\n\nWhen a branch is locked:\nAll financial transactions are automatically redirected to the company wallet\nStaff access is limited to prevent unauthorized actions. Use this feature to maintain security, compliance, and centralized control when necessary.",
  },
  {
    target: ".branch-title-input",
    placement: "bottom",
    title: "Branch Title",
    content:
      "Enter the official branch name or title of the branch.\n\nThis name will appear across all records, reports, and internal systems, so make sure it is unique, descriptive, and easy to identify (e.g., Ikeja Main Branch, Abuja HQ, Lekki Phase 1 Office).\nKeep it short and clear for easy reference.",
  },
  {
    target: ".state-lga-selection",
    placement: "bottom",
    title: "State & Local Government Selection",
    content:
      "Select the State and corresponding Local Government Area (LGA) where the branch is located.\n\nThis ensures accurate location mapping and helps in organizing branch records by region.\nPlease choose carefully to reflect the branch’s actual address.",
  },
  {
    target: ".city-street-input",
    placement: "bottom",
    title: "City & Street Details",
    content:
      "City: Select the city or town where the branch is located.\nStreet Name/Number: Enter only the office number, building name, or street (e.g., 12 Allen Avenue, Plot 4B, Admiralty Way).\n\n📌 Note: Please do not enter the full address here — the system will automatically generate the complete address using your selected state, LGA, and city.",
  },
  {
    target: ".wallet-selection-toggle",
    placement: "bottom",
    title: "Activate Wallet Selection",
    content:
      "Use this option to enable or disable the wallet for this branch.\n\nWhen Yes, the branch can receive and manage its own funds independently.\nWhen No, all financial transactions will be routed directly to the company wallet.",
  },
  {
    target: ".about-branch-textarea",
    placement: "bottom",
    title: "About Branch",
    content:
      "Provide a brief description of the branch, including its purpose, services offered, coverage area, or any other relevant information.\n\nThis helps potential clients and administrators quickly understand the scope of the branch within the organization.",
  },
  {
    target: ".branch-picture-upload",
    placement: "bottom",
    title: "Branch Picture or Sample Selection",
    content:
      "Upload a photo of the branch or select a sample image to visually represent it in the system.\n\nYou can use a real image of the office/building\nOr choose from available sample images if a photo isn't ready\nThis image will appear on dashboards, reports, and listings websites, helping identify the branch at a glance.",
  },
  {
    target: ".branch-bank-account-input",
    placement: "bottom",
    title: "Branch Bank Account Details",
    content:
      "Provide the official bank account details for this branch. This account will be used to process collections, disbursements, and other financial transactions specific to the branch.\n\n📌 Note: If left blank, the system will automatically default to the company’s main bank account when displaying bank details to branch clients.",
  },
  {
    target: ".delete-branch-button",
    placement: "right",
    title: "Delete Branch",
    content:
      "Click this button to permanently remove the selected branch from the system.\n\n⚠️ Warning: This action is irreversible.\nAll associated data including staff and property records linked to this branch will be deleted.\nHowever, branches currently assigned to active management will not be deleted for security and operational reasons.\nOnly proceed if you’re certain the branch is no longer in use.",
  },
  {
    target: ".update-branch-button",
    placement: "left",
    title: "Update Branch",
    content:
      "Click this button to save any changes made to the branch details.\n\nThis includes updates to the branch name, address, contact information, wallet settings, bank account details, and more.\nMake sure all information is accurate before updating to ensure smooth operations and proper record-keeping.\n\nUse this feature to maintain security, compliance, and centralized control when necessary.",
  },
];
