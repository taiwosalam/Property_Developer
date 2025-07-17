
import { TourStep } from "../types";

export const createTenancyAgreementSteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "👋 Welcome to Create Tenancy Agreement",
    content:
      "Here, you can <b>create reusable tenancy agreements</b> for both new and renewing tenants, based on the selected property. These agreements are saved as drafts for future use and editing.<br/><br/>Simply <b>toggle on</b> and <b>select all the terms<b/> you want included in the tenancy agreement to suit your property and lease conditions. <br/><br/>Already know how it works? You can <b>skip the tour</b> anytime.",
  },
  {
    target: ".toggle-section",
    placement: "bottom",
    title: "⚙️ Toggle Section",
    content:
      "Use this section to <b>turn on or off specific terms and clauses</b> you want included in the tenancy agreement.<br/><br/>Each toggle represents a <b>standard legal or property-specific condition</b> (e.g., payment terms, maintenance responsibilities, notice period). <br/>You can customize the agreement by enabling only the clauses that apply to your property or tenancy situation.",
  },
  {
    target: ".create-preview-button",
    placement: "left",
    title: "🟢 Create & Preview Button",
    content:
      "Click this button to <b>generate and preview</b> the tenancy agreement based on your selected terms and property details. <br/><br/><b>Create:</b> Saves the agreement as a draft that you can reuse or edit later. <br/><b>Preview:M/b> Allows you to review the full document before using it on the rent page, ensuring all clauses and clause information are correct.",
  },
];