import { TourStep } from "../types";

export const createDisbursementSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 Welcome to Disbursement",
    content:
      "Here, you can <b>manage, record, and track all fund disbursements</b> made by your company toward property management expenses or payment release to the landlord.<br/><br/>Already familiar with the process? You can <b>skip the tour</b> anytime.",
  },
  {
    target: ".property-selection-dropdown",
    placement: "bottom",
    title: "Property Selection Overview",
    content:
      "Choose the property where the disbursement payment will be recorded. This links the transaction directly to the selected property and its units, ensuring accurate and traceable financial reporting.",
  },
  {
    target: ".disbursement-method-dropdown",
    placement: "bottom",
    title: "Select Disbursement Method",
    content:
      "Use this dropdown to choose the <b>method of disbursement</b> used for the payment. Selecting the correct disbursement method ensures accurate financial records and helps in future audits or reconciliations.",
  },
  {
    target: ".expense-details-form",
    placement: "bottom",
    title: "Expenses Details",
    content:
      "Provide clear and accurate information for each expense you are recording. This ensures full transparency and accurate tracking in your property's financial records.",
  },
  {
    target: ".add-property-disbursement-button",
    placement: "top",
    title: "Add Property Disbursement",
    content:
      "Click this option to <b>add an expense entry</b> to the disbursement record for the selected property.<br/><br/>You can use this option to <b>add multiple expense records</b>, ensuring all property-related costs are captured accurately in one disbursement session.",
  },
  {
    target: ".add-unit-disbursement-button",
    placement: "top",
    title: "Add Unit Disbursement",
    content:
      "Use this option to <b>record a disbursement tied to a specific unit</b> within the selected property: Select the <b>unit name or number</b>, expense details, and amount.<br/><br/>Use <b>Add Unit Disbursement</b> when a specific unit within a property incurs its own costs.",
  },
  {
    target: ".create-button",
    placement: "left",
    title: "Create Button",
    content:
      "Click this button to <b>finalize and save</b> all disbursement entries you've added: It will store the recorded expenses for the selected property or unit.",
  },
];
