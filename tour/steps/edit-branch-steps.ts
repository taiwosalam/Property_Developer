
import { TourStep } from "../types";

export const editBranchSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "🛠️ Edit Branch Details",
    content:
      "This section allows you to <b>update and manage key information</b> about your branch, including the branch name, address, contact details, and other essential settings. <br/><br/>Need to make changes? You're in the right place. <br/>Already know your way around? You can skip the tour at any time.",
  },
  {
    target: ".lock-branch-button",
    placement: "left",
    title: "🔒 Lock Branch",
    content:
      "Click this button to <b>lock the branch</b>, restricting branch staff from logging in or performing key operations such as wallet transactions, staff management, or property-related activities. <br/><br/>When a branch is locked:<br/><br/>All financial transactions are automatically redirected to the <b>company wallet</b> <br/>Staff access is limited to prevent unauthorized actions. <br/><br/>Use this feature to maintain <b>security, compliance, and centralized control</b> when necessary.",
  },
  {
    target: ".branch-title-input",
    placement: "bottom",
    title: "🏢 Branch Title",
    content:
      "Enter the official branch name or title of the branch.<br/><br/>This name will appear across all records, reports, and internal systems, so make sure it is unique, descriptive, and easy to identify (e.g., Ikeja Main Branch, Abuja HQ, Lekki Phase 1 Office). <br/><br/>Keep it short and clear for easy reference.",
  },
  {
    target: ".state-lga-selection",
    placement: "bottom",
    title: "🗺️ State & Local Government Selection",
    content:
      "Select the <b>State</b> and corresponding <b>Local Government Area (LGA)</b> where the branch is located. <br/><br/>This ensures accurate location mapping and helps in organizing branch records by region.<br/><br/>Please choose carefully to reflect the branch’s actual address.",
  },
  {
    target: ".city-street-input",
    placement: "bottom",
    title: "🏙️ City & Street Details",
    content:
      "<b>City:</b> Select the <b>city or town<b/> where the branch is located. <br/> <b>Street Name/Number:</b> Enter only the <b>office number, building name, or street</b> (e.g., 12 Allen Avenue, Plot 4B, Admiralty Way).<br/><br/>📌 <i>Note: Please do not enter the full address here — the system will automatically generate the complete address using your selected state, LGA, and city.</i>",
  },
  {
    target: ".wallet-selection-toggle",
    placement: "bottom",
    title: "💼 Activate Wallet Selection",
    content:
      "Use this option to <b>enable or disable the wallet</b> for this branch. <br/><br/>When <b>Yes</b>, the branch can receive and manage its own funds independently. <br/>When <b>No</b>, all financial transactions will be routed directly to the <b>company wallet.</b>",
  },
  {
    target: ".about-branch-textarea",
    placement: "bottom",
    title: "📝 About Branch",
    content:
      "Provide a brief <b>description of the branch</b>, including its purpose, services offered, coverage area, or any other relevant information.<br/><br/>This helps potential clients and administrators quickly understand the <b>scope</b> of the branch within the organization.",
  },
  {
    target: ".branch-picture-upload",
    placement: "bottom",
    title: "🖼️ Branch Picture or Sample Selection",
    content:
      "Upload a <b>photo of the branch</b> or select a <b>sample image</b> to visually represent it in the system. <br/><br/>You can use a real image of the office/building <br/>Or choose from available sample images if a photo isn't ready <br/><br/>This image will appear on dashboards, reports, and listings websites, helping identify the branch at a glance.",
  },
  {
    target: ".branch-bank-account-input",
    placement: "bottom",
    title: "🏦 Branch Bank Account Details",
    content:
      "Provide the <b>official bank account details</b> for this branch. This account will be used to process <b>collections, disbursements,</b> and other financial transactions specific to the branch.<br/><br/>📌 <i>Note: If left blank, the system will automatically default to the <b>company’s main bank account</b> when displaying bank details to branch clients.<i/>",
  },
  {
    target: ".delete-branch-button",
    placement: "right",
    title: "🗑️ Delete Branch",
    content:
      "Click this button to <b>permanently remove</b> the selected branch from the system. <br/><br/>⚠️ <b>Warning:</b> This action is irreversible. <br/><br/>All associated data including <b>staff and property records</b> linked to this branch will be deleted. <br/>However, <b>branches currently assigned to active management</b> will <b>not</b> be deleted for security and operational reasons. <br/>Only proceed if you’re certain the branch is no longer in use.",
  },
  {
    target: ".update-branch-button",
    placement: "left",
    title: "🔄 Update Branch",
    content:
      "Click this button to <b>save any changes</b> made to the branch details. <br/><br/>This includes updates to the branch name, address, contact information, wallet settings, bank account details, and more. <br/><br/>Make sure all information is accurate before updating to ensure smooth operations and proper record-keeping.\n\nUse this feature to maintain security, compliance, and centralized control when necessary.",
  },
];
