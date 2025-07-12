import { TourStep } from "../types";

export const createFacilitySteps: TourStep[] = [
  {
    target: "body",
    title: "Take a Quick Tour!",
    content: `This guided walkthrough will help you set up Unit Details, Listing Information, and Management Preferences step-by-step, ensuring all essential information is captured for effective property management.
Already familiar with the process? Feel free to skip the tour at any time.
`,
    placement: "center",
    disableBeacon: true,
  },
  {
    target: ".progress-overview-wrapper",
    placement: "bottom",
    title: "Creation Progress Bar Overview",
    content: `The progress bar offers a clear, step-by-step visual guide to track your progress as you create property. It highlights each required section and shows how much you’ve completed, helping you stay organized and on track throughout the entire unit setup process.
`,
  },
  {
    target: ".property-picture-upload-wrapper",
    placement: "bottom",
    title: "Property Picture Overview",
    content:
      "Upload clear, high-quality images to visually represent the facility/estate for easier recognition within the platform. While not mandatory, adding pictures improves internal management and reference. You can upload up to 6 images and drag your preferred photo to the first position to set it as the default display image.",
  },
  {
    target: ".property-category-wrapper",
    placement: "bottom",
    title: "Category Overview",
    content:
      "Choose the category that best describes the type of management you're setting up - facility, or Estate. Selecting the correct category is essential, as it determines how your management will be organized and what features the system will provide for it. Proper classification ensures accurate setup and access to the tools relevant to your management.",
  },
  {
    target: ".property-name-wrapper",
    placement: "bottom",
    title: "Estate/Facility Name Overview",
    content:
      "The name field will dynamically update to display either Facility Name or Estate Name based on the selected category. Enter a clear and descriptive name for the management entity as you want it to appear on your dashboard. This ensures easy identification and effective management within the platform. <br /> <br /> Use a specific name that reflects the property's true identity such as its official name, type, or a unique identifier, to avoid confusion when handling multiple properties.\nExamples: “Kolapo Ishola GRA” or “Ikoyi Plaza.”",
  },
  {
    target: ".property-state-wrapper",
    placement: "bottom",
    title: "State Selection Overview",
    content:
      "Choose the state where your management is located. This selection determines the available options for the Local Government Area (LGA) dropdown, helping to narrow down the exact administrative region. It also influences the City/Area choices, ensuring accurate location details for your property. Selecting the correct state is essential for precise property classification and management within the platform.",
  },
  {
    target: ".property-street-wrapper",
    placement: "bottom",
    title: "Street Name/Number Overview",
    content:
      "Enter the specific street name and number where the property is located. Providing accurate street details helps pinpoint the exact location of your property, making it easier for tenants and clients to find. Please do not include local government, city, or area names in this field, and avoid using spaces or special characters to ensure proper formatting and system compatibility.",
  },
  {
    target: ".property-branch-wrapper",
    placement: "bottom",
    title: "Branch Selection Overview",
    content:
      "A management cannot be created without assigning it to a branch. Select the appropriate branch or office location that fits your management structure. This helps organize properties based on operational zones, teams, or geographic regions. <br /> <br /> If your company oversees multiple properties across different branches or cities, assigning the correct branch ensures accurate reporting, task management, and staff accountability.\nTo create or manage branches, go to Management > Staff & Branches.",
  },
  {
    target: ".property-officer-wrapper",
    placement: "bottom",
    title: "Account Manager Overview",
    content:
      "Assign an Account Manager responsible for overseeing the financial and operational activities of the management. This person will serve as the main point of contact for income tracking, expense approvals, and day-to-day property oversight.<br /> <br /> Choosing the right Account Manager ensures accountability and organized reporting within your team. The selected individual should already exist in your system under Management > Staff & Branches. Assigning them here links their responsibilities directly to this property for streamlined communication and performance tracking.",
  },
  {
    target: ".property-staff-wrapper",
    placement: "bottom",
    title: "Staff Assignment Overview",
    content:
      "Select the staff members who will be actively involved in managing this property. These individuals can include property supervisors, maintenance personnel, field agents, or any other team members responsible for the property's daily operations.<br /> <br /> Assigning staff helps streamline task delegation, communication, and accountability. It ensures that the right team is connected to the right property, making follow-ups, reporting, and on-ground activities more efficient. Staff must already be added under Management > Staff & Branches to appear in this list.",
  },
  {
    target: ".property-description-wrapper",
    placement: "bottom",
    title: "Description Overview",
    content:
      "This field is optional. Provide a concise, clear description of the property that highlights its key features, layout, and amenities. If you’d like, leverage our AI content generator to draft a description or use the AI content editor - access these tools via the last two icons on the left within the description input to refine your existing text.",
  },
  {
    target: ".property-agency-fee-wrapper",
    placement: "bottom",
    title: "Management Fee Overview",
    content:
      "Enter the percentage of the agency fee charged for managing the property. This fee covers services provided by your agency, including its management and facilitation.",
  },
  {
    target: ".property-currency-wrapper",
    placement: "bottom",
    title: "Currency Selection Overview",
    content:
      "Select the default currency to be used for managing this property's financial transactions on the platform. This setting determines how fees, and other charges are displayed and calculated throughout the system. Available Options: Naira (₦), Dollar ($) and Pounds (£).",
  },
  {
    target: ".property-group-chat-wrapper",
    placement: "top",
    title: "Group Chat Option",
    content:
      "Enable or disable the Group Chat feature to allow tenants, occupants, or property management teams to communicate collectively within the platform. <br /><br /> Yes: Automatically create a group chat including everyone assigned to the property, making collaboration and discussions easy and efficient.\nNo: Disable group chat to restrict communication to individual or private messages only.",
  },
  {
    target: ".property-penalty-wrapper",
    placement: "top",
    title: "Fee Penalty Option",
    content:
      "Enable or disable fee penalty charges for late renewal payments within the platform.<br /><br />Yes: Activate fee penalty to automatically apply fees when tenants or occupants pay rent past the due date, encouraging timely payments.\nNo: Disable fee penalty if you do not want to charge late fees for overdue rent payments.",
  },
  {
    target: ".property-request-call-back-wrapper",
    placement: "top",
    title: "Request Call Back Option",
    content:
      "Choose whether to enable or disable the 'Request Call Back' feature for occupants, or prospects.<br /><br />Yes: Allow users to request a call back directly from the property interface. This helps streamline communication and ensures prompt follow-up by your team.\nNo: Disable the call back option if you prefer to manage all communications through other channels or do not offer this service.",
  },
  {
    target: ".property-book-visitors-wrapper",
    placement: "top",
    title: "Book Visitors Option",
    content:
      "Turn the Book Visitors feature on or off to manage how visitor access is handled for the property. This option is ideal for properties located within gated estates, communities, or facilities that require visitor authorization for entry.<br /><br />Yes: Allow tenants or occupants to pre-book and manage visitor access directly from the platform. This enhances security, ensures proper visitor tracking, and streamlines entry processes.\nNo: Disable this feature if visitor management is not necessary or is handled manually at the property.",
  },
  {
    target: ".property-vehicle-records-wrapper",
    placement: "top",
    title: "Vehicle Records Option",
    content:
      "Enable or disable the Vehicle Records feature to manage and keep track of vehicles associated with occupants within the property. <br /> <br />Yes: Activate this feature to allow the recording of vehicle details (such as plate numbers, type, and ownership). Useful for properties with gated access, parking management, or security tracking.\nNo: Disable this option if vehicle records are not required or are managed outside the platform.",
  },
  {
    target: ".property-active-vat-wrapper",
    placement: "top",
    title: "Activate 7.5% VAT Option",
    content:
      "Enable or disable the automatic application of 7.5% Value Added Tax (VAT) to applicable rent or service charges within the property.<br /> <br />Yes: Apply 7.5% VAT to all relevant property transactions. This is useful for properties or agencies required to charge VAT for legal or accounting compliance.\nNo: Exclude VAT from charges if it is not applicable to your property management operations.",
  },
  {
    target: ".unit-action-buttons",
    placement: "top",
    title: "Action Button Overview",
    content:
      "The Clear Field button resets all fields on the form, deleting any data you've entered so far.<br />The Add Unit button finalizes the creation of the property record and redirects you to the next page where you can begin adding units under that property.<br /><br /> Note: A property must have at least one unit to be published. Properties created without units will be saved as pending and can be found under Listing > Property Draft/Request.",
  },
  //-------------------------------------------
 
];
