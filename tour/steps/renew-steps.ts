import { TourStep } from "../types";

export const renewRentSteps: TourStep[] = [
  {
    target: "body",
    content:
      "Learn how to seamlessly renew a tenant’s or occupant’s stay. Already know the process? Feel free to skip the tour.",
    placement: "center",
    title: "Not Sure How It Works? Take a Quick Tour!",
    disableBeacon: true,
  },
  {
    target: ".estate-details-wrapper",
    placement: "bottom",
    title: "Property Details Overview",
    content:
      "Preview already configures property settings to ensure the unit aligns with your preferred management setup.",
  },
  {
    target: ".estate-settings-wrapper",
    placement: "bottom",
    title: "Property Setting Card",
    content:
      "View how the property is currently displayed and managed on your dashboard. <br />If the information shown doesn’t meet your management requirements, click the Edit button to customize and update the unit details to better suit your workflow.",
  },
  {
    target: ".pending-invoice-payment-wrapper",
    placement: "top",
    title: "Renewal Details",
    content:
      "Check the renewal details, including rent amount and period.<br />Verify these before proceeding.",
  },
  {
    target: ".current-rent-details-wrapper",
    placement: "right",
    title: "Current Rent",
    content:
      "This section displays the detailed breakdown of the new rent charges for the selected unit, including base rent, fees, and any additional costs. <br /> Use the toggle feature to control how payments are applied: Charges are applied based on whether the tenant or occupant is new or renewing.",
  },
  {
    target: ".renewal-rent-wrapper",
    placement: "right",
    title: "Renewal Payment Overview",
    content:
      "This section displays the detailed breakdown of the new rent charges for the selected unit, including base rent, fees, and any additional costs. <br /> Use the toggle feature to control how payments are applied: Charges are applied based on whether the tenant or occupant is new or renewing.",
  },
  {
    target: ".renew-rent-option-container",
    placement: "right",
    title: "Renewal Payment Overview",
    content:
      "This section enables you to record and manage full rent payments made by tenants or occupants for period renewals. <br />This section also shows unpaid or overdue rent, rent penalties, and other fees for the selected tenant, occupant, or unit. It helps you quickly identify outstanding balances so you can follow up on payments and keep accurate financial records. Use this feature to stay informed and ensure timely rent collection.",
  },
  {
    target: ".outstanding-details-wrapper",
    placement: "right",
    title: "Outstanding Details",
    content:
      "This section also shows unpaid or overdue rent, rent penalties, and other fees for the selected tenant, occupant, or unit. It helps you quickly identify outstanding balances so you can follow up on payments and keep accurate financial records. Use this feature to stay informed and ensure timely rent collection.",
  },
  {
    target: ".complete-part-payment-wrapper",
    placement: "right",
    title: "Part Payment",
    content:
      "Add a part payment if the tenant can’t pay in full.<br />Enter the amount and date.",
  },
  {
    target: ".renew-rent-date-checkboxoptions-wrapper",
    placement: "right",
    title: "Tenant Profile",
    content:
      "Confirm the tenant’s profile details.<br />Ensure this is the correct tenant.",
  },
  {
    target: ".renew-rent-part-payment-wrapper",
    placement: "right",
    title: "Part Payment Overview",
    content:
      "This section lets you manage and track partial payments made by tenants or occupants. Simply select the payment date, enter the amount received, and click the Update button. <br />Each payment entered is automatically deducted from the total amount due, displaying only the outstanding balance. This feature allows flexible payment plans while maintaining accurate financial records and ensuring transparency in rent collection.<br /><b>Toggle Preferences</b><br/>Customize your management experience by enabling or disabling options based on your workflow: <br /><b>Invoice Toggle:</b> Switch on to mark the invoice as awaiting payment from the mobile user; switch off to confirm payment has been received and verified. <br /><b>Notification Toggle (Mobile Users):</b> Enable to send alerts to tenants when a new unit is assigned to them. <br /><b>SMS Toggle:</b> Activate to send SMS notifications to tenants (note: SMS service may incur additional charges). <br /><b>Email Toggle:</b> Enable to send email notifications about new unit assignments to selected tenants or occupants.",
  },
  {
    target: ".matched-profile-wrapper",
    placement: "left",
    title: "Selected Profile",
    content:
      "Preview the tenant or occupant profile currently assigned to the property unit to confirm the correct individual is selected. This step is crucial for accurate management and record keeping.",
  },
  {
    target: ".previous-records-container",
    placement: "top",
    title: "Previous Record Overview",
    content:
      "This section offers a snapshot of past tenancy and occupancy information, including previous unit assignments, payment dates, and occupancy durations. It helps you maintain a comprehensive and traceable rental history for effective property management.",
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
    title: "You're All Set!",
    content:
      "You’ve completed the tour!<br />You’re ready to renew the rent or fee.<br />Click 'Finish' to close.",
  },
];
