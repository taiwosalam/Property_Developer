import { TourStep } from "../types";

export const selectUnitRentSteps: TourStep[] = [
  {
    target: "body",
    content:
      "Discover how to easily manage and transfer tenants or occupants between units within the same property. <br />If you’re already familiar with the process, you can skip the tour anytime.",
    placement: "center",
    title: "Not sure how it works? Take a Quick Tour!",
    disableBeacon: true,
  },
  {
    target: ".estate-details-wrapper",
    placement: "bottom",
    title: "Property Details Overview",
    content:
      "Preview configure key property settings to ensure unit aligns with your preferred management structure.",
  },
  {
    target: ".estate-settings-wrapper",
    placement: "bottom",
    title: "Property Setting Card",
    content:
      "See how property is currently displayed and managed on your dashboard. <br />If the shown details don’t match your management needs, simply click the Edit button to customize and update the unit’s information to fit your workflow better.",
  },
  {
    target: ".previous-unit-balance",
    placement: "bottom",
    title: "Previous Unit Balance",
    content:
      "View a detailed summary of the outstanding rent or fees for the selected unit. This section highlights any previous balances along with a breakdown of charges and payments related to the unit.",
  },
  {
    target: ".new-rent-wrapper",
    placement: "right",
    title: "New Breakdown and Toggle",
    content:
      "This section displays the detailed breakdown of the new rent charges for the selected unit, including base rent, fees, and any additional costs. Use the toggle feature to control how payments are applied: Charges are applied based on whether the tenant or occupant is new or renewing.",
  },
  {
    target: ".calculation-toggle",
    placement: "right",
    title: "Calculation Toggle",
    content:
      "Use the toggle feature to control how payments are applied: <br /><b>Deduct:</b> Automatically subtracts previous payments from the new rent total, giving you an updated balance due.<br /><b>Do Not Deduct:</b> Keeps the new rent amount intact without subtracting any prior payments, showing the full charge to be paid. <br />This flexibility helps you manage rent calculations accurately based on your preferred billing approach.",
  },
  {
    target: ".payment-status-wrapper",
    placement: "right",
    title: "Payment Status Details",
    content:
      "This section helps you track payment progress in real-time and ensures precise financial reporting. After all deductions are applied, it clearly indicates whether you owe the tenant/occupant a balance or if they still have an outstanding amount to pay. <br />All payments recorded at this stage are treated by the platform as received, verified, and fully settled for the selected period.",
  },
  {
    target: ".start-new-unit-rent-wrapper",
    placement: "top",
    title: "Start Date & Due Date",
    content:
      "Once you're satisfied with how the rent charges are set; whether for a new or renewal tenancy - you’ll select the Start Date for when the period should begin reflecting. The Due Date will be automatically generated based on the rental period defined in your property settings.",
  },
  {
    target: ".previous-records-container",
    placement: "top",
    title: "Previous Record Overview",
    content:
      "This section provides a preview of historical tenancy or occupancy data, including previous unit assignments, payment dates, and occupancy timelines of tenants or occupants who assigned the unit. It helps you maintain a complete and traceable rental history for better property management.",
  },
  {
    target: "matched-profile-wrapper",
    placement: "left",
    title: "Selected Profile",
    content:
      "Preview the tenant or occupant profile currently assigned to the property unit to ensure the correct individual has been selected. It is essential for proper management and record keeping.",
  },
  {
    target: "body",
    placement: "center",
    title: "You're All Set!",
    content:
      "You’ve completed the tour!<br />You’re now ready to select a new unit and proceed with the transfer.<br />Click 'Finish' to close the tour.",
  },
];
