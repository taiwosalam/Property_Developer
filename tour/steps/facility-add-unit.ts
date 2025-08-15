import { TourStep } from "../types";

export const addFacilityUnit: TourStep[] = [
  {
    target: "body",
    title: "Take a Quick Tour!",
    content: `This guided walkthrough will help you set up Unit Details and Management Preferences step-by-step, ensuring all essential information is captured for effective property management.
Already familiar with the process? Feel free to skip the tour at any time.
`,
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".progress-overview-wrapper",
    placement: "bottom",
    title: "Progress Bar Overview",
    content:
      "The progress bar offers a clear, step-by-step visual guide to track your progress as you create units. It highlights each required section and shows how much you’ve completed, helping you stay organized and on track throughout the entire unit setup process.",
  },
  {
    target: ".property-details-wrapper",
    placement: "bottom",
    title: "Property Details Overview",
    content:
      "Preview how your property is currently displayed and managed on your dashboard. If the shown details don’t match your management preferences, click the Back button to customize and update the property information to better fit your workflow.",
  },
  {
    target: ".property-settings-wrapper",
    placement: "bottom",
    title: "Settings Card",
    content:
      "Check and verify the essential information about your property, such as its location, type, size, and features. If you notice any details that need correction or updating, simply click the edit button to make the necessary changes.",
  },
  {
    target: ".unit-picture-wrapper",
    placement: "bottom",
    title: "Unit Picture Overview",
    content:
      "Upload clear, high-quality images to visually represent the unit. While this step is optional, adding photos enhances your listing’s appeal. You can drag and drop your preferred image to the first position to set it as the default display image.",
  },
  {
    target: ".unit-name-wrapper",
    placement: "bottom",
    title: "Unit Name Overview",
    content:
      "Enter a clear and descriptive name for the property unit as you want it to appear on your dashboard. This makes it easier to identify and manage each unit within the platform. Use a specific name that reflects the unit’s identity, such as a house number, suite number, or unique identifier; for example, 'House 8 Road 2' or 'Office 2 Block U.' When creating multiple units at once, the initial unit name will be auto-generated with a serial count added to each additional unit for easy differentiation.",
  },
  {
    target: ".unit-type-wrapper",
    placement: "bottom",
    title: "Unit Type Overview",
    content:
      "Choose the primary classification that best describes the unit you are creating. Your selection will determine the available options in the Unit Sub-Type dropdown, allowing you to further define the unit’s specific characteristics.<br/><br/>Selecting the correct Unit Type ensures proper categorization and streamlines the management process, helping you keep your property records organized and tailored to your needs.",
  },
  {
    target: ".unit-subtype-wrapper",
    placement: "bottom",
    title: "Unit Sub-Type Overview",
    content:
      "After selecting the Unit Type, choose the Unit Sub-Type that best describes the specific style or layout of the unit. This helps further define the unit’s features and differentiates it within its main category.<br/><br/>Accurately selecting the Unit Sub-Type improves property classification and supports more precise management.",
  },
  {
    target: ".unit-preference-wrapper",
    placement: "bottom",
    title: "Unit Preferences Overview",
    content:
      "This dynamic dropdown menu lets you select specific features of the unit based on the previously chosen Property Type and Unit Sub-Type. The available options adjust automatically to reflect relevant characteristics, ensuring that only applicable features are shown.<br/><br/>Choosing the right unit features helps provide detailed information about the unit, improving listing accuracy and enhancing tenant or occupant matching for effective property management.",
  },
  {
    target: ".unit-feature-wrapper",
    placement: "top",
    title: "Unit Feature: Measurement",
    content:
      "They are optional, enter the exact measurements of the unit’s land size to provide an accurate representation of its area. This may include dimensions such as square footage, square meters, or total land size depending on the selected unit type and subtype.<br/> <br/>Precise measurement details are crucial for tenant assessment, pricing decisions, and effective space management. Use this feature to ensure all size-related information is accurately recorded and readily available.",
  },
  {
    target: ".unit-fee-breakdown-wrapper",
    placement: "bottom",
    title: "Unit Fee",
    content:
      "This section details the complete breakdown of fees and charges applicable to the occupant assigned into the unit. It includes fees, security deposits, agency fees, maintenance charges, and any other relevant costs.",
  },
  {
    target: ".unit-fee-renewal-details",
    placement: "top",
    title: "Unit Fee Renewal",
    content:
      "This section outlines the detailed breakdown of fees and charges applicable when an occupant renews their stay for the unit.<br /><br />Providing a clear fee breakdown during renewal helps maintain transparency, ensures occupants understand their financial obligations, and supports accurate financial tracking for continued property management.",
  },
  {
    target: ".unit-action-buttons",
    placement: "left",
    title: "Action Button Overview",
    content:
      "The Add More Units button lets you duplicate the current unit’s information to quickly create multiple similar units. If you select “Yes” after clicking this button, the system will copy the filled form data for the number of units you want to add. Use this feature only when the new units share similar details with the current one.<br/>If the units you want to add are different, select “No” to receive a fresh input form for each new unit.<br/><br/>The Save button finalizes the creation of the property and its units, then redirects you to the property page. From there, you can edit, add more units, or delete data as needed.<br/><br/>Note: All required fields must be properly completed to enable adding more units.",
  },
];
