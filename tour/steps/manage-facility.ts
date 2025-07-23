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
    title: "Fee Penalty Option",
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


  // Add units  
  {
    target: ".property-save-button-wrapper",
    placement: "left",
    title: "Action Button Overview (Add/Save Units)",
    content:
      "Add More Units: Use this option to add duplicate unit details for creating multiple similar units. Selecting “Yes” will replicate the filled form data for the number of units specified. Choose this only if the new units share similar attributes. Selecting “No” will open a fresh form for unique entries. <br/><br/>Save: Apply all changes and update the property and its units. After saving, you will be redirected to the property page where you can continue editing, add more units, or delete entries as needed.<br/><br/>Note: All mandatory fields must be correctly completed to enable adding or updating units.",
  },
  {
    target: ".unit-pictures-upload",
    placement: "bottom",
    title: "Unit Picture Overview",
    content:
      "Update or upload clear, high-quality images to accurately represent the unit and maintain its appeal to potential clients. Adding distinct photos enhances your listing’s reliability and visual impact. You may upload up to 14 images and reorder them by dragging your preferred photo to the first position, which sets it as the default display image. Ensure each unit listing features unique interior and exterior photos—avoid reusing the same images across multiple units to preserve listing accuracy.",
  },
  {
    target: ".unit-name-input",
    placement: "bottom",
    title: "Unit Name Overview",
    content:
      "Edit the unit’s name to ensure it remains clear and descriptive as it appears on your dashboard and listings. A specific, identifiable name - such as a room number, flat number, or unique label (e.g., “Room 8” or “Flat 2 Block U”) helps you efficiently manage and distinguish each unit. For bulk edits or additions, the system will auto-generate names with serial numbers for easy differentiation.",
  },
  {
    target: ".unit-type-selector",
    placement: "bottom",
    title: "Unit Type Overview",
    content:
      "Modify the primary classification of the unit to reflect its correct category. This selection influences the available options in the Unit Sub-Type dropdown, enabling further refinement of the unit’s characteristics. Accurate Unit Type selection optimizes your property categorization and management.",
  },
  {
    target: ".unit-sub-type-selector",
    placement: "bottom",
    title: "Unit Sub-Type Overview",
    content:
      "After updating the Unit Type, choose the Unit Sub-Type that best describes the unit’s specific layout or style. This further defines the unit within its category and supports more precise property management.",
  },
  {
    target: ".unit-preferences-selector",
    placement: "bottom",
    title: "Unit Preferences Overview",
    content:
      "This responsive dropdown adjusts automatically based on your selected Property Type and Unit Sub-Type, presenting relevant unit features. Select appropriate preferences to provide detailed unit information, improving listing accuracy and enhancing tenant or occupant matching.",
  },
  {
    target: ".unit-measurement-form",
    placement: "top",
    title: "Unit Feature: Measurement",
    content:
      "Update the exact measurements of the unit’s land or floor area, using units such as square feet or square meters as appropriate. Precise measurement data supports tenant evaluation, pricing accuracy, and effective space management.",
  },
  {
    target: ".new-tenant-fee-form",
    placement: "top",
    title: "Unit Fee Breakdown - New Tenant",
    content:
      "Review and update the comprehensive fee breakdown applicable to new tenants moving into the unit. This includes rent, security deposits, agency fees, maintenance charges, and any other relevant costs. Transparent fee details ensure tenant clarity and facilitate accurate financial tracking.",
  },
  {
    target: ".renewal-tenant-fee-form",
    placement: "top",
    title: "Unit Fee Breakdown - Renewal Tenants",
    content:
      "Update the fee structure for tenants renewing their lease, including rent adjustments, renewal fees, outstanding balances, and other applicable charges. Clear fee communication promotes transparency and supports ongoing financial management.",
  },
  {
    target: ".add-more-units-button",
    placement: "left",
    title: "Action Button Overview - Add More Units",
    content:
      "Use this option to duplicate the current unit’s details for creating multiple similar units. Selecting “Yes” will replicate the filled form data for the number of units specified. Choose this only if the new units share similar attributes. Selecting “**No**” will open a fresh form for unique entries.",
  },
  {
    target: ".save-button",
    placement: "left",
    title: "Action Button Overview - Save",
    content:
      "Apply all changes and update the property and its units. After saving, you will be redirected to the property page where you can continue editing, add more units, or delete entries as needed.\n\n**Note**: All mandatory fields must be correctly completed to enable adding or updating units.",
  },
  {
    target: ".incomplete-unit-warning",
    placement: "center",
    title: "Unit Not Yet Updated!",
    content:
      "These unit details were auto-generated based on the number you selected for duplication and have not been fully completed or saved yet. Please review and update all required information to ensure accurate management and proper listing on your dashboard.\n\nMake sure to upload the correct pictures for each unit, complete all necessary fields, and click the Update button to save your changes and add the unit to the property list. Use the Remove button to delete the unit card if needed.\n\nIncomplete units will not be published or available for tenant assignment. The platform cannot store or process units without updated and accurate details, including the exact unit pictures.",
  },
];
