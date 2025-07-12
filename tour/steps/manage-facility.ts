import { TourStep } from "../types";

export const editPropertySteps: TourStep[] = [
  {
    target: "body",
    placement: "center",
    title: "Take a Quick Tour!",
    content:
      "This walkthrough will help you create Property details, Unit details, property listing, and Management detail, step-by-step, ensuring all necessary details are included for efficient property management. You can skip at any time if you're already familiar.",
  },
  {
    target: ".property-picture-upload-wrapper",
    placement: "bottom",
    title: "Property Picture Overview",
    content:
      "Upload clear, high-quality images to visually represent the property for easier recognition within the platform. While not mandatory, adding pictures improves internal management and reference. You can upload up to 6 images and drag your preferred photo to the first position to set it as the default display image.",
  },
  {
    target: ".property-category-wrapper",
    placement: "bottom",
    title: "Category Overview",
    content:
      "Review and, if needed, update the category that best describes the type of your management. This classification affects how the property is managed and determines which features are available on the platform.",
  },
  {
    target: ".property-name-wrapper",
    placement: "bottom",
    title: "Property Name Overview",
    content:
      "Edit the property's name as it should appear on your dashboard and listings. A clear and specific name such as a known identifier, property type, or estate name - helps distinguish it from others, especially when managing multiple properties.<br/><br/>Examples: “Kolapo GRA” or “Ikoyi Complex.”",
  },
  {
    target: ".property-state-wrapper",
    placement: "bottom",
    title: "State Selection Overview",
    content:
      "Ensure the selected state accurately reflects the property's location. This field filters available Local Government Areas (LGAs) and influences City/Area options, supporting precise location tracking across your portfolio.",
  },
  {
    target: ".property-street-wrapper",
    placement: "bottom",
    title: "Street Name/Number Overview",
    content:
      "Update the specific street name and number to pinpoint the property's exact location. Keep the entry clean, exclude LGA, city names, or special characters.",
  },
  {
    target: ".property-branch-wrapper",
    placement: "bottom",
    title: "Branch Selection Overview",
    content:
      "Verify or reassign the property to the appropriate branch. This is essential for reporting, staff coordination, and property grouping across regions.<br/><br/>To edit branches, go to: Management > Staff & Branches",
  },
  {
    target: ".property-officer-wrapper",
    placement: "bottom",
    title: "Account Manager Overview",
    content:
      "Update the assigned Account Manager responsible for the property's finances and daily oversight. This role is critical for tracking income, approving expenses, and maintaining accountability. The selected individual must already exist in your system under Management > Staff & Branches.",
  },
  {
    target: ".property-staff-wrapper",
    placement: "bottom",
    title: "Staff Assignment Overview",
    content:
      "Review and update the staff members linked to the property's operations. This may include supervisors, agents, or maintenance personnel. Proper assignment enhances communication, task tracking, and on-site accountability.",
  },
  {
    target: ".property-description-wrapper",
    placement: "bottom",
    title: "Property Description Overview",
    content:
      "Refine or revise the property's description to summarize key features, amenities, and layout. A compelling description enhances internal clarity and improves public-facing listings.<br/><br/>Need help? Use the AI content generator or AI content editor—available via the last two icons in the description field.",
  },
  {
    target: ".property-agency-fee-wrapper",
    placement: "bottom",
    title: "Management Fee",
    content:
      "Update the agency fee percentage charged for managing the property. Accurate entry supports transparent billing for services like tenant placement and property oversight.",
  },
  {
    target: ".property-currency-wrapper",
    placement: "bottom",
    title: "Currency Selection Overview",
    content:
      "Select or update the default currency for financial transactions.<br/><br/>Options: Naira (₦), Dollar ($), Pounds (£)<br/>Correct currency selection ensures consistency in accounting and reporting.",
  },
  {
    target: ".property-group-chat-wrapper",
    placement: "bottom",
    title: "Group Chat Option",
    content:
      "Toggle this setting to allow or restrict group communication for tenants and staff.<br/><br/>Yes: Automatically create a group chat for collaborative discussions.<br/>No: Limit interactions to private or direct messages.",
  },
  {
    target: ".property-penalty-wrapper",
    placement: "bottom",
    title: "FeePenalty Option",
    content:
      "Enable or disable late payment penalties.<br/><br/>Yes: Apply charges when rent is overdue.<br/>No: Disable penalties for flexible payment handling.",
  },
  {
    target: ".property-request-call-back-wrapper",
    placement: "bottom",
    title: "Request Call Back Option",
    content:
      "Choose whether tenants or prospects can request a call back via the platform.<br/><br/>Yes: Allow prompt follow-ups.<br/>No: Use alternative communication methods.",
  },
  {
    target: ".property-book-visitors-wrapper",
    placement: "bottom",
    title: "Book Visitors Option",
    content:
      "Manage visitor access by enabling this feature. Ideal for secured estates or facilities.<br/><br/>Yes: Allow tenants to pre-register visitors.<br/>No: Disable if managed offline.",
  },
  {
    target: ".property-vehicle-records-wrapper",
    placement: "bottom",
    title: "Vehicle Records Option",
    content:
      "Track vehicles linked to tenants or residents.<br/><br/>Yes: Record plate numbers and types for security or parking management.<br/>No: Disable if vehicle tracking isn’t required.",
  },
  {
    target: ".property-active-vat-wrapper",
    placement: "bottom",
    title: "Activate 7.5% VAT Option",
    content:
      "Choose whether to apply 7.5% VAT on relevant transactions.<br/><br/>Yes: VAT is automatically calculated where applicable.<br/>No: Omit VAT from billing.",
  },
  {
    target: ".property-update-button-wrapper",
    placement: "left",
    title: "Action Button Overview (Update)",
    content:
      "Any changes made will not be saved unless you click the Update button.<br/><br/>To apply your edits, click Update - this ensures all modifications are saved and reflected across the platform in real time, keeping your property data accurate and up to date.",
  },
  {
    target: ".property-save-button-wrapper",
    placement: "left",
    title: "Action Button Overview (Add/Save Units)",
    content:
      "Add More Units: Use this option to add duplicate unit details for creating multiple similar units. Selecting “Yes” will replicate the filled form data for the number of units specified. Choose this only if the new units share similar attributes. Selecting “No” will open a fresh form for unique entries. <br/><br/>Save: Apply all changes and update the property and its units. After saving, you will be redirected to the property page where you can continue editing, add more units, or delete entries as needed.<br/><br/>Note: All mandatory fields must be correctly completed to enable adding or updating units.",
  },
];
