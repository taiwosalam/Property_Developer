
import { TourStep } from "../types";

export const createDisbursementSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Welcome to your Disbursement",
    content:
      "Here, you can manage, record and track all fund releases from your company to the property management cost.\n\nAlready know your way around? You can skip the tour anytime.",
  },
  {
    target: ".property-selection",
    placement: "bottom",
    title: "Property Selection Overview",
    content:
      "Select the property for which you want to record the disbursement payment. This action links your entry to a specific property and its associated units, ensuring accurate financial tracking.\n\nIf the property you’re looking for isn’t listed, please verify that it has been properly added to the system under Management > Property before proceeding.",
  },
  {
    target: ".unit-selection",
    placement: "bottom",
    title: "Unit Selection Overview",
    content:
      "Select the specific unit or any applicable unit within the chosen property to record the disbursement payment. This ensures the transaction is accurately linked to the correct unit in the property’s financial records.\n\nThe list of available units will be automatically filtered based on the property you selected.\nIf you don’t see the unit listed, please ensure it has been created under Management > Units for the selected property before continuing.",
  },
  {
    target: ".expense-details-form",
    placement: "bottom",
    title: "Expenses Details and Add Expenses Overview",
    content:
      "Enter clear and accurate information for the expense you’re recording. Include a brief but specific description that outlines what the expense covers. This helps ensure transparency and proper tracking within your property’s financial records.\n\nProvide a concise title that summarizes the nature of the expense. This title will be used to identify the expense in reports and records, so ensure it is specific and relevant - for example, “Plumbing Repairs” or “Generator Maintenance.”\n\nEnter the exact amount spent on this expense. This figure should reflect the total cost incurred and will be used to update the financial records associated with the selected property or unit. Be sure to input the value accurately to maintain financial integrity.",
  },
  {
    target: ".payment-overview",
    placement: "top",
    title: "",
    content: ""
  },
  {
    target: ".payment-overview-section",
    placement: "bottom",
    title: "Payment Overview",
    content:
      "This section updates the expense records linked to the selected property or unit. All expense amounts added displayed here and automatically accumulated for accurate tracking. You can also remove any entry before final submission.\n\nReview the total expense balance, continue adding more entries if needed, or proceed to finalize. After submission, you can still manage or edit the records from the expense management section.",
  },
];