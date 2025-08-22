import { TourStep } from "../types";

export const startRentSteps: TourStep[] = [
  {
    target: "body",
    content:
      "Learn how to assign tenants or occupant to a unit and begin a new rent or fee of period with ease. If you're already familiar with the process, you can choose to skip the tour.",
    placement: "center",
    title: "Ready to Get Started? Take a Quick Tour",
    disableBeacon: true,
  },
  {
    target: ".estate-details-wrapper",
    placement: "bottom",
    title: "Property Unit Card Overview",
    content:
      "The Unit Card offers a quick snapshot of each property unit, allowing you to easily monitor and confirm its current status and key details at a glance.",
  },
  {
    target: ".estate-settings-wrapper",
    placement: "bottom",
    title: "Property Settings Card",
    content:
      "Let you preview how each unit within a property is displayed and managed on your dashboard. If the current summary doesn’t suit your management needs, simply click the Edit button to adjust the details to fit your preferences.",
  },
  {
    target: ".new-tenant-fee-card",
    placement: "right",
    title: "Payment Card Overview",
    content:
      "The Payment Card offers a clear breakdown of new rent or fee charges, enabling you to quickly verify the accuracy of the details before assigning them to tenants or occupants. If any information is incorrect, simply click the edit button on the property card to make adjustments.",
  },
  {
    target: ".select-tenant-with-dropdown",
    placement: "top",
    title: "Tenant/Occupant Profile Selection",
    content:
      "Easily assign a tenant or occupant to a property unit by selecting from your existing list of tenant profiles. To add new tenants or occupants, go to the Management menu on your dashboard and select the Tenants & Occupants submenu. All registered tenant records will appear here for quick access and selection.",
  },
  {
    target: ".select-tenant-using-id",
    placement: "top",
    title: "Choose with ID",
    content:
      "This option enables you to match and assign a tenant or occupant by selecting their profile using already registered Identification Number or Email Address. Please note: this feature is only available for tenants or occupants already saved in your tenants & occupants records.",
  },
  {
    target: ".start-rent-start-and-end-date",
    placement: "top",
    title: "Start Date & Due Date",
    content:
      "Define the timeline for each tenancy or period by selecting the Start Date, which marks when the tenant’s or occupant payment period begins. The Due Date is automatically calculated based on the duration you’ve configured in your property settings, to ensuring accurate billing and renewal tracking.",
  },
  {
    target: ".checkbox-options",
    placement: "top",
    title: "Toggle Preferences",
    content:
      "Customize your management experience with the Toggle Preferences feature. This control allows you to enable or disable specific options based on your workflow and what matters most to you. <br /><b>Invoice Toggle:</b> Turn on to mark the invoice as awaiting payment from the mobile user, or turn off to confirm payment has been received and verified. <br /><b>Notification Toggle (Mobile Users):</b> Enable this to send alerts to tenants when a new unit is assigned to them. <br /><b>SMS Toggle:</b> Activate to send text message notifications to tenants (note: SMS service incurs additional charges). <br /><b>Email Toggle:</b> Enable to send email notifications about new unit assignments to selected tenants or occupants.",
  },
  {
    target: ".start-rent-button",
    placement: "top",
    title: "Action Button",
    content:
      "This button guides you through the final steps of assigning a tenant or occupant to a unit. Before clicking, ensure a Tenancy Agreement has been created for rental properties - otherwise, the system will not allow you to proceed. The button is dynamic and adjusts based on your intention type: <br /><b>Start Rent:</b> Use this to begin the rental period for a tenant. It activates the rent cycle, starts payment tracking from the chosen start date, and triggers the tenancy agreement for completion. <br /><b>Proceed:</b> Select this when saving an existing tenant record without initiating a new agreement. This stores the data in your dashboard and links the tenant to the unit. <br /><b>Move In:</b> Use this when assigning an occupant in a facility or non-rental setup. It confirms the entry and moves to the final steps with activating a period cycle.",
  },
  {
    target: "body",
    placement: "center",
    title: "You're All Set!",
    content:
      "You’ve completed the tour! You’re now ready to start the rent or move-in process. Click 'Finish' to close the tour.",
  },
];
