import { TourStep } from "../types";

export const addUnitSteps: TourStep[] = [
  {
    target: "body",
    content:
      "This guided walkthrough will help you set up Unit Details, Listing Information, and Management Preferences step-by-step, ensuring all essential information is captured for effective property management.<br />Already familiar with the process? Feel free to skip the tour at any time.",
    placement: "center",
    title: "Start Here? Take a Quick Tour!",
    disableBeacon: true,
  },
  {
    target: ".add-unit-flowgress",
    placement: "bottom",
    title: "Creation Progress Bar Overview",
    content:
      "The progress bar offers a clear, step-by-step visual guide to track your progress as you create units. It highlights each required section and shows how much you’ve completed, helping you stay organized and on track throughout the entire unit setup process.",
  },
  {
    target: ".unit-property-details-wrapper",
    placement: "bottom",
    title: "Property Details Overview",
    content:
      "Check and verify the essential information about your property, such as its location, type, size, and features. If you notice any details that need correction or updating, simply click the edit button to make the necessary changes.",
  },
  {
    target: ".unit-propert-settings-wrapper",
    placement: "bottom",
    title: "Property Settings Card",
    content:
      "Preview how your property is currently displayed and managed on your dashboard. If the shown details don’t match your management preferences, click the Back button to customize and update the property information to better fit your workflow.",
  },
  {
    target: ".unit-form-pictures-wrapper",
    placement: "bottom",
    title: "Unit Picture Overview",
    content:
      "Upload clear, high-quality images to visually showcase the unit and attract potential clients. Adding pictures enhances your listing and provides a reliable reference. You can upload up to 14 images and drag your preferred photo to the first position to set it as the default display image. Avoid using the same pictures for multiple units - ensure each unit listing has its own accurate interior and exterior photos.",
  },
  {
    target: ".unit-name-wrapper",
    placement: "top",
    title: "Unit Name Overview",
    content:
      "Enter a clear and descriptive name for the property unit as you want it to appear on your dashboard and listings. This makes it easier to identify and manage each unit within the platform. Use a specific name that reflects the unit’s identity, such as a room number, flat number, or unique identifier; for example, 'Room 8' or 'Flat 2 Block U.' <br /> When creating multiple units at once, the initial unit name will be auto-generated with a serial count added to each additional unit for easy differentiation.",
  },
  {
    target: ".unit-type-wrapper",
    placement: "top",
    title: "Unit Type Overview",
    content:
      "Choose the primary classification that best describes the unit you are creating. Your selection will determine the available options in the Unit Sub-Type dropdown, allowing you to further define the unit’s specific characteristics. <br />Selecting the correct Unit Type ensures proper categorization and streamlines the management process, helping you keep your property records organized and tailored to your needs.",
  },
  {
    target: ".unit-subtype-wrapper",
    placement: "top",
    title: "Unit Sub-Type Overview",
    content:
      "After selecting the Unit Type, choose the Unit Sub-Type that best describes the specific style or layout of the unit. This helps further define the unit’s features and differentiates it within its main category. <br />Accurately selecting the Unit Sub-Type improves property classification and supports more precise management.",
  },
  {
    target: ".unit-preference-wrapper",
    placement: "top",
    title: "Unit preferences Overview",
    content:
      "This dynamic dropdown menu lets you select specific features of the unit based on the previously chosen Property Type and Unit Sub-Type. The available options adjust automatically to reflect relevant characteristics, ensuring that only applicable features are shown. <br />Choosing the right unit features helps provide detailed information about the unit, improving listing accuracy and enhancing tenant or occupant matching for effective property management.",
  },
  {
    target: ".unit-features-wrapper",
    placement: "top",
    title: "Unit Feature: Measurement",
    content:
      "Enter the exact measurements of the unit’s land size to provide an accurate representation of its area. This may include dimensions such as square footage, square meters, or total land size depending on the selected unit type and subtype. <br />Precise measurement details are crucial for tenant assessment, pricing decisions, and effective space management. Use this feature to ensure all size-related information is accurately recorded and readily available.",
  },
  {
    target: ".unit-fee-breakdown-new-tenant",
    placement: "top",
    title: "Unit Fee Breakdown - New Tenant",
    content:
      "This section details the complete breakdown of fees and charges applicable to a new tenant moving into the unit. It includes rent, security deposits, agency fees, maintenance charges, and any other relevant costs. <br />Understanding the fee breakdown helps ensure transparency and sets clear expectations for tenants from the start, while enabling you to manage and track all financial aspects accurately within the platform.",
  },
  {
    target: ".unit-fee-breakdown-renew-tenant",
    placement: "top",
    title: "Unit Fee Breakdown - Renewal Tenants",
    content:
      "This section outlines the detailed breakdown of fees and charges applicable when a tenant renews their lease for the unit. It includes rent adjustments, renewal fees, any outstanding balances, and other applicable charges. <br />Providing a clear fee breakdown during renewal helps maintain transparency, ensures tenants understand their financial obligations, and supports accurate financial tracking for continued property management.",
  },
  {
    target: ".unit-footer-actions",
    placement: "top",
    title: "Action Button Overview",
    content:
      "The Add More Units button lets you duplicate the current unit’s information to quickly create multiple similar units. If you select 'Yes' after clicking this button, the system will copy the filled form data for the number of units you want to add. Use this feature only when the new units share similar details with the current one. <br />If the units you want to add are different, select “No” to receive a fresh input form for each new unit. <br />The Save button finalizes the creation of the property and its units, then redirects you to the property page. From there, you can edit, add more units, or delete data as needed. <br /><b>Note:</b> All required fields must be properly completed to enable adding more units.",
  },
  {
    target: "body",
    placement: "center",
    title: "You're All Set!",
    content:
      "You’ve completed the tour!<br />You’re ready to add units.<br />Click 'Finish' to close.",
  },
];
