import { TourStep } from "../types";

export const createPropertySteps: TourStep[] = [
  {
    target: "body",
    content:
      "This walkthrough will help you create Property details, Unit details, property listing, and Management detail, step-by-step, ensuring all necessary details are included for efficient property management. You can skip at any time if you're already familiar.",
    placement: "center",
    title: "Start Here? Take a Quick Tour!",
    disableBeacon: true,
  },
  {
    target: ".progress-overview-wrapper",
    placement: "bottom",
    title: "Creation Progress Bar Overview",
    content:
      "The progress bar provides a clear, step-by-step visual guide to track your progress during the property creation process. It highlights each required section and shows how far you've gone, helping you stay organized from start to finish.",
  },
  {
    target: ".property-picture-upload-wrapper",
    placement: "bottom",
    title: "Property Picture Overview",
    content:
      "Upload clear, high-quality images to visually represent the property for easier recognition within the platform. While not mandatory, adding pictures improves internal management and reference. You can upload up to 6 images and drag your preferred photo to the first position to set it as the default display image.",
  },
  {
    target: ".youtube-video-link-wrapper",
    placement: "bottom",
    title: "YouTube Link Overview",
    content:
      "Add a YouTube video link to enrich your property listing with a detailed virtual tour or walkthrough of the exact property. This optional feature helps potential clients better visualize the space. Just paste a valid YouTube URL, and the video will be automatically embedded and displayed across all units under the property.",
  },
  {
    target: ".property-category-wrapper",
    placement: "top",
    title: "Category Overview",
    content:
      "Choose the category that best describes the type of property you're setting up - residential, commercial, or mixed-use. Selecting the correct category is essential, as it determines how your property will be organized and what features the system will provide for its management. Proper classification ensures accurate setup and access to the tools relevant to your management.",
  },
  {
    target: ".property-name-wrapper",
    placement: "top",
    title: "Property Name Overview",
    content:
      "Enter a clear and appropriate name for the property as you want it to appear on your dashboard and listings. This helps you easily identify and manage the property within the platform. Use a specific name that reflects the property's identity; such as the given name, type, or a unique identifier - to avoid confusion when managing multiple properties. For example, 'Queen Cottage' or 'Ikoyi Lodge.'",
  },
  {
    target: ".property-state-wrapper",
    placement: "top",
    title: "State Selection Overview",
    content:
      "Choose the state where the property is located. This selection determines the available options for the Local Government Area (LGA) dropdown, helping to narrow down the exact administrative region. It also influences the City/Area choices, ensuring accurate location details for your property. Selecting the correct state is essential for precise property classification and management within the platform.",
  },
  {
    target: ".property-street-wrapper",
    placement: "top",
    title: "Street Name/Number Overview",
    content:
      "Enter the specific street name and number where the property is located. Providing accurate street details helps pinpoint the exact location of your property, making it easier for tenants and clients to find. Please do not include local government, city, or area names in this field, and avoid using spaces or special characters to ensure proper formatting and system compatibility.",
  },
  {
    target: ".coordinate-wrapper",
    placement: "top",
    title: "Coordinate Overview",
    content:
      "Enter the geographic coordinates (latitude and longitude) to accurately place the property on the map. This improves location precision and makes it easier for tenants, visitors, and service teams to find the property. <br />You can either: Drag the map pin to the exact spot, or Use your current location if you're at the property during creation.",
  },
  {
    target: ".property-landlord-wrapper",
    placement: "top",
    title: "Landlord Selection Overview",
    content:
      "Choose the landlord associated with this property from your existing list of landlord profiles. This step ensures the property is properly linked to its owner for accurate recordkeeping, reporting, and financial management. <br />If the landlord isn't listed yet, you’ll need to first add their details under the <b>Management > Landlords</b> section before completing this step. Selecting the correct landlord is essential for seamless communication, rent tracking, and accountability.",
  },
  {
    target: ".property-branch-wrapper",
    placement: "top",
    title: "Branch Selection Overview",
    content:
      "A property cannot be created without assigning it to a branch. Select the appropriate branch or office location that fits your management structure. This helps organize properties based on operational zones, teams, or geographic regions. <br /> If your company oversees multiple properties across different branches or cities, assigning the correct branch ensures accurate reporting, task management, and staff accountability. <br />To create or manage branches, go to Management > Staff & Branches.",
  },
  {
    target: ".property-officer-wrapper",
    placement: "top",
    title: "Account Manager Overview",
    content:
      "Assign an Account Manager responsible for overseeing the financial and operational activities of the property. This person will serve as the main point of contact for income tracking, expense approvals, and day-to-day property oversight. Choosing the right Account Manager ensures accountability and organized reporting within your team. The selected individual should already exist in your system under <br /><b>Management > Staff & Branches</b>. Assigning them here links their responsibilities directly to this property for streamlined communication and performance tracking.",
  },
  {
    target: ".property-staff-wrapper",
    placement: "top",
    title: "Staff Assignment Overview",
    content:
      "Select the staff members who will be actively involved in managing this property. These individuals can include property supervisors, maintenance personnel, field agents, or any other team members responsible for the property's daily operations. <br />Assigning staff helps streamline task delegation, communication, and accountability. It ensures that the right team is connected to the right property, making follow-ups, reporting, and on-ground activities more efficient. Staff must already be added under <b>Management > Staff & Branches</b> to appear in this list.",
  },
  {
    target: ".property-description-wrapper",
    placement: "top",
    title: "Staff Assignment Overview",
    content:
      "Enter a clear and concise description of the property, summarizing its key features, layout, amenities, and unique selling points. Use this field to highlight what makes the property attractive to tenants or clients. A well-written description enhances understanding and improves external presentation when listings are shared publicly. <br />You can also use the <b>>AI content generator</b> to create a description for you or use the AI content editor; accessible via the last two icons on the left in the description input to refine your existing write-up.",
  },
  {
    target: ".property-agency-fee-wrapper",
    placement: "top",
    title: "Agency Fee Overview",
    content:
      "Enter the percentage of the agency fee charged for managing or leasing the property. This fee covers services provided by your agency, including tenant sourcing, property management, and lease facilitation. Clearly specifying the agency fee ensures transparency for landlords and tenants and supports accurate financial tracking within the platform.",
  },
  {
    target: ".property-new-agency-fee-wrapper",
    placement: "top",
    title: "Who Pays the Agency Fee (New Rent)",
    content:
      "Select who is responsible for paying the agency fee on new rental agreements. This could be the landlord, the tenant, or shared between both parties. Clearly defining the payer ensures smooth financial transactions and avoids confusion during lease setup.",
  },
  {
    target: ".property-renew-agency-fee-wrapper",
    placement: "top",
    title: "Who Pays the Agency Fee (Renewal Rent)",
    content:
      "Choose who will be responsible for paying the agency fee when a tenant renews their lease. This can be the landlord, the tenant, or a shared arrangement. Specifying the payer helps maintain clarity and accuracy in financial management during lease renewals.",
  },
  {
    target: ".property-caution-deposit-wrapper",
    placement: "top",
    title: "Caution Deposit Overview",
    content:
      "A caution deposit is collected from tenants before move-in as a security measure to protect landlords against potential damages, unpaid rent, or breaches of contract. Clearly defining the caution deposit promotes transparency and helps manage tenant expectations within the platform. <br /><b>Who Holds the Caution Deposit?</b><br />Select where the caution deposit will be held from the available options. Choosing *None* means no caution deposit is required. Selecting the appropriate option ensures clear responsibility and proper handling of tenant deposits.",
  },
  {
    target: ".property-currency-wrapper",
    placement: "top",
    title: "Currency Selection Overview",
    content:
      "Select the default currency to be used for managing this property's financial transactions on the platform. This setting determines how rent, fees, and other charges are displayed and calculated throughout the system.<br /><b>Available Options:</b> <b>Naira (₦)</b>, <b>Dollar ($)</b> and <b>Pounds (£)</b>.Choosing the appropriate currency ensures accurate financial reporting and consistency in all property-related records.",
  },
  {
    target: ".property-group-chat-wrapper",
    placement: "top",
    title: "Caution Deposit Overview",
    content:
      "Enable or disable the Group Chat feature to allow tenants, occupants, or property management teams to communicate collectively within the platform. <br /><b>Yes:</b> Automatically create a group chat including everyone assigned to the property, making collaboration and discussions easy and efficient.<br /><b>No:</b> Disable group chat to restrict communication to individual or private messages only.",
  },
  {
    target: ".property-penalty-wrapper",
    placement: "top",
    title: "Rent Penalty Option",
    content:
      "Enable or disable rent penalty charges for late rent payments within the platform. <br /><b>Yes:</b>  Activate rent penalty to automatically apply fees when tenants or occupants pay rent past the due date, encouraging timely payments.<br /><b>No:</b>  Disable rent penalty if you do not want to charge late fees for overdue rent payments.",
  },
  {
    target: ".property-request-call-back-wrapper",
    placement: "top",
    title: "Request Call Back Option",
    content:
      "Choose whether to enable or disable the 'Request Call Back' feature for tenants, occupants, or prospects. <br /><b>Yes:</b> Choose whether to enable or disable the 'Request Call Back' feature for tenants, occupants, or prospects.<br /><b>No:</b> Disable the call back option if you prefer to manage all communications through other channels or do not offer this service.",
  },
  {
    target: ".property-book-visitors-wrapper",
    placement: "top",
    title: "Book Visitors Option",
    content:
      "Turn the Book Visitors feature on or off to manage how visitor access is handled for the property. This option is ideal for properties located within gated estates, communities, or facilities that require visitor authorization for entry. <br /><b>Yes:</b> Allow tenants or occupants to pre-book and manage visitor access directly from the platform. This enhances security, ensures proper visitor tracking, and streamlines entry processes.<br /><b>No:</b> Disable this feature if visitor management is not necessary or is handled manually at the property.",
  },
  {
    target: ".property-vehicle-records-wrapper",
    placement: "top",
    title: "Vehicle Records Option",
    content:
      "Enable or disable the Vehicle Records feature to manage and keep track of vehicles associated with tenants or occupants within the property.<br /><b>Yes:</b>  Activate this feature to allow the recording of vehicle details (such as plate numbers, type, and ownership). Useful for properties with gated access, parking management, or security tracking.<br /><b>No:</b>  Disable this option if vehicle records are not required or are managed outside the platform.",
  },
  {
    target: ".property-active-vat-wrapper",
    placement: "top",
    title: "Activate 7.5% VAT Option",
    content:
      "Enable or disable the automatic application of 7.5% Value Added Tax (VAT) to applicable rent or service charges within the property.<br /><b>Yes:</b>  Apply 7.5% VAT to all relevant property transactions. This is useful for properties or agencies required to charge VAT for legal or accounting compliance.<br /><b>No:</b> Exclude VAT from charges if it is not applicable to your property management operations.",
  },
  {
    target: ".property-inventory-wrapper",
    placement: "top",
    title: "Inventory Overview",
    content: `Use this section to <b>activate inventory tracking</b> for each unit within the selected property. This allows you to record and monitor all items provided in the space such as furniture, appliances, and fixtures for better asset management.<br/><br/>
              <b>Yes:</b> Enable inventory tracking for all units in the property. This ensures detailed documentation and accountability for every item included.<br/><br/>
              <b>No:</b> Disable inventory tracking for this property. Inventory records will not be required or displayed for its units.
                `,
  },
  {
    target: ".create-property-form-footer",
    placement: "left",
    title: "Action Button Overview",
    content:
      "The Clear Field button resets all fields on the form, deleting any data you've entered so far.<br />The Add Unit button finalizes the creation of the property record and redirects you to the next page where you can begin adding units under that property <br/><br/><b>Note:</b> A property must have at least one unit to be published. Properties created without units will be saved as pending and can be found under <b>Listing > Property Draft/Request.</b>",
  },
  {
    target: "body",
    placement: "center",
    title: "Tour Guide Complete – What’s Next?",
    content:
      "You’ve successfully completed the introduction walkthrough. This final screen confirms that you’ve reviewed and understood the key sections of the platform. The tour has familiarized you with the essential features, making it easier to navigate and manage your dashboard confidently. <br />You can now proceed with your tasks, or restart the tour if you’d like a quick refresher.",
  },
];
