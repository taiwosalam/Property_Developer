import api, { handleAxiosError } from "@/services/api";

export const staffConfigurations = [
  {
    title: "admin configuration (company director)",
    // subTitle:
    //   "Can be accessed through mobile app, software, or web cross-platform.",
    permissions: [
      [
        "Add Other Directors",
        "Change Company Module",
        "Manage Messages & Reviews",
        "Notification Preferences",
        "Reset System Settings",
        "Modify SMS Sender Name",
        "Update Bank Details",
        "Set Authorized Signature",
        "Change Wallet PIN",
      ],
      [
        "Customize Appearance",
        "Manage Enrollment Settings",
        "Access Management Settings",
        "Modify Company Information",
        "Configure SMTP Settings",
        "Edit Services",
        "Manage Subscription Settings",
        "Full Wallet Access",
      ],
    ],
  },
  {
    title: "partner configuration (branch manager)",
    // subTitle:
    //   "Can be accessed through mobile app, software, or web cross-platform.",
    permissions: [
      [
        "Can view and reply branch messages",
        "Can add/delete branch properties",
        "Can view and edit branch profile",
        "Can upgrade or downgrade branch staff account",
        "Can check in visitors",
        "Can create Examine",
        "Can manage inspections",
        "Can create and manage announcement",
        "Can add and manage tenants/occupants",
        "Can view and reply property reviews",
        "Can view call request",
      ],
      [
        "Can add and manage tenants/occupants",
        "Can add/delete branch staff",
        "Can add and manage landlords/landlady",
        "Can view complaints",
        "Can create inventory",
        "Can create service provider",
        "Can check in and manage vehicle records",
        "Can approve and refund caution deposit",
        "Can manage reminder",
        "Can view property request",
      ],
    ],
  },
  {
    title: "colleague configuration (account officer)",
    // subTitle:
    //   "Can be accessed through mobile app, software, or web cross-platform.",
    permissions: [
      [
        "Can manage assign tenants/occupants",
        "Can manage assign properties",
        "Can manage inspections",
        "Can add and manage tenants occupants",
        "Can view service provider",
        "Can create announcement",
        "Can add properties to branch",
        "Can create branch inventory",
        "Can reply assigned messages",
        "Can check in and manage vehicle records",
      ],
      [
        "Can manage assigned landlord/landlady",
        "Can view assign account statement",
        "Can check in visitors",
        "Can check calendars",
        "Can create branch examine",
        "Can reply to inspections",
        "Can view complaints",
        "Can view call request",
        "Can create examine",
        "Can add/delete branch properties",
      ],
    ],
  },
  {
    title: "staff configuration (other staff) Configuration",
    // subTitle: "Can be accessed through mobile app or web cross-platform.",
    permissions: [
      [
        "Can be added to task",
        "Can view assigned complaints",
        "Can view announcement",
        "Can create examine",
        "Can reply to inspections",
        "Can view service provider",
        "Can manage inspections",
      ],
      [
        "Can check in visitors",
        "Can view assigned request",
        "Can create inventory",
        "Can reply assign messages",
        "Can check calendars",
        "Can check in vehicle records",
        "Can view and reply assigned messages",
      ],
    ],
  },
  {
    title: "Users Configuration (Landlord, Occupant & Tenants)",
    // subTitle: "Can be accessed through mobile app or web cross-platform.",
    permissions: [
      [
        "Create Profile Account For Tenants/Occupant",
        "Create Profile Account For Landlord/Landlady",
      ],
      [
        "Create Profile Account For Service Provider",
        "Create Profile Account When You Sent Invite",
      ],
    ],
  },
];

export type RentPeriod =
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "biennially"
  | "triennially"
  | "quadrennial"
  | "quinquennial"
  | "sexennial"
  | "septennial"
  | "octennial"
  | "nonennial"
  | "decennial";

export const PERCENTAGE_OPTIONS = [
  "1%",
  "2%",
  "2.5%",
  "3%",
  "3.5%",
  "5%",
  "6%",
  "7%",
  "7.5%",
  "8%",
  "9%",
  "10%",
];

export const RENT_PERIODS: Array<{
  value: RentPeriod;
  label: string;
  desc: string;
  options: string[];
}> = [
  {
    value: "daily",
    label: "Daily",
    desc: "Select the percentage to be charged per hour on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "weekly",
    label: "Weekly",
    desc: "Select the percentage to be charged per daily on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "monthly",
    label: "Monthly",
    desc: "Select the percentage to be charged per weekly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quarterly",
    label: "Quarterly",
    desc: "Select the percentage to be charged per monthly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "yearly",
    label: "Yearly",
    desc: "Select the percentage to be charged per quarterly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "biennially",
    label: "Biennially",
    desc: "Select the percentage to be charged per yearly on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "triennially",
    label: "Triennially",
    desc: "Select the percentage to be charged per biennially on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quadrennial",
    label: "Quadrennial",
    desc: "Select the percentage to be charged per triennially on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quinquennial",
    label: "Quinquennial",
    desc: "Select the percentage to be charged per quadrennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "sexennial",
    label: "Sexennial",
    desc: "Select the percentage to be charged per quinquennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "septennial",
    label: "Septennial",
    desc: "Select the percentage to be charged per sexennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "octennial",
    label: "Octennial",
    desc: "Select the percentage to be charged per septennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "nonennial",
    label: "Nonennial",
    desc: "Select the percentage to be charged per octennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "decennial",
    label: "Decennial",
    desc: "Select the percentage to be charged per nonennial on late rent",
    options: PERCENTAGE_OPTIONS,
  },
];

// /company/permissions
export const updateSettingsManagement = async (data: FormData) => {
  try {
    data.append("_method", "PATCH");
    const res = await api.post("/company/permissions", data);
    if (res.status === 200) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
  }
};
