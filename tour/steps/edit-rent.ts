// edit-rent-steps.ts
import { TourStep } from "../types";

export const editRentSteps: TourStep[] = [
  {
    target: "body",
    content:
      "Learn how to efficiently manage tenants or occupants already assigned to a unit and streamline your ongoing property operations with ease. <br />If you’re already familiar with the process, feel free to skip the tour.",
    placement: "center",
    title: "You don't know how? Take a Quick Tour",
    disableBeacon: true,
  },
  {
    target: ".back-button",
    placement: "right",
    title: "Back Button",
    content:
      "Click here to return to the previous page.<br />Use this if you need to exit the Edit Rent process without saving changes.",
  },
  {
    target: ".estate-details-wrapper",
    placement: "bottom",
    title: "Property Settings Card",
    content:
      "Preview how each unit under a property is currently shown and managed on your dashboard. <br />If the displayed details don’t align with your management preferences, click the Edit button to customize and update the unit’s information to better suit your workflow.",
  },
  {
    target: ".estate-settings-wrapper",
    placement: "bottom",
    title: "Property Settings Overview",
    content:
      "Preview configure key property settings to ensure unit aligns with your preferred management structure.",
  },
  {
    target: ".current-rent-details",
    placement: "top",
    title: "Current Rent Breakdown",
    content:
      "Get a detailed view of the active rent or fee structure for the selected unit. This section outlines the breakdown of rent or fee and other applicable charges associated with the unit.",
  },
  {
    target: ".renewal-fee-wrapper",
    placement: "top",
    title: "Renewal Payment Overview",
    content:
      "This section provides a clear breakdown of the payment details for rent or fee renewal. It includes the updated amount and period. ",
  },
  {
    target: ".upfront-payment-wrapper",
    placement: "right",
    title: "Upfront Payment",
    content:
      "Use this section to edit the current rent amount or set an upfront payment.<br />Select a start date and toggle options like invoice creation as needed.",
  },
  {
    target: ".part-payment-wrapper",
    placement: "right",
    title: "Part Payment Overview",
    content:
      "This section enables you to manage and track partial payments made by tenants or occupants. Simply select the payment date, enter the amount received, and click the Update button. <br />Each payment entered is automatically deducted from the total package, showing only the outstanding balance. This feature supports flexible payment arrangements while helping you maintain accurate financial records and ensure transparency throughout the rent collection process. <br />Customize your management experience with the Toggle Preferences feature. This control allows you to enable or disable specific options based on your workflow and what matters most to you. <br /><b>Invoice Toggle:</b> Turn on to mark the invoice as awaiting payment from the mobile user, or turn off to confirm payment has been received and verified.<br /><b>Notification Toggle (Mobile Users):</b> Enable this to send alerts to tenants when a new unit is assigned to them.<br /><b>SMS Toggle:</b> Activate to send text message notifications to tenants (note: SMS service incurs additional charges). <br /><b>Email Toggle:</b> Enable to send email notifications about new unit assignments to selected tenants or occupants.",
  },
  {
    target: ".matched-profile-wrapper",
    placement: "left",
    title: "Selected Profile",
    content:
      "Preview the tenant or occupant profile currently assigned to the property unit to ensure the correct individual has been selected. It is essential for proper management and record keeping.",
  },
  {
    target: ".transfer-tenants-wrapper",
    placement: "left",
    title: "Tenant/Occupant Transfer Overview",
    content:
      "Seamlessly transfer a tenant or occupant from one unit to another - either within the same property or across different properties. This feature ensures record continuity while offering the flexibility to reassign occupants as needed.Use one of the two available options: <br />Relocate within the same property.Reassign to a unit in another property. <br /><b>Note:</b> Make sure the target unit is vacant before initiating the transfer to ensure a smooth update.",
  },
  {
    target: ".previous-records-container",
    placement: "top",
    title: "Previous Record Overview",
    content:
      "This section provides a preview of historical tenancy or occupancy data, including previous unit assignments, payment dates, and occupancy timelines of tenants or occupants who assigned the unit. It helps you maintain a complete and traceable rental history for better property management.",
  },
  {
    target: ".fixed-footer-wrapepr",
    placement: "top",
    title: "Action Button",
    content:
      "This button lets you save all changes and updates made during unit management. Use it to confirm and store your adjustments, ensuring your property records remain accurate and up to date.",
  },
  {
    target: "body",
    placement: "center",
    title: "Tour Guide Complete – What’s Next?",
    content:
      "You’ve successfully completed the introduction walkthrough. This final screen confirms that you’ve reviewed and understood the key sections of the platform. The tour has familiarized you with the essential features, making it easier to navigate and manage your dashboard confidently. <br />You can now proceed with your tasks, or restart the tour if you’d like a quick refresher.",
  },
];
