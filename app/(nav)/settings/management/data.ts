import api, { handleAxiosError } from "@/services/api";

export const staffConfigurations = [
  {
    title: "staff configuration (branch manager)",
    subTitle:
      "Can be accessed through mobile app, software, or web cross-platform.",
    permissions: [
      [
        "Can view and reply branch messages",
        "Can add/delete branch properties",
        "Can view and edit branch profile",
        "Can upgrade or downgrade branch staff account",
        "Can view branch request",
        "Can approve/decline account officer property added",
        "Can check in visitors",
        "Can view all requests",
        "Can create Examine",
        "Can manage inspections",
        "Can create and manage announcement",
        "Can add and manage tenants/occupants",
        "Can view and reply branch reviews",
      ],
      [
        "Can add/delete branch staff",
        "Can add/delete branch staff",
        "Can view branch account statement",
        "Can approve/decline account officer portfolio",
        "Can add and manage landlords/landlady",
        "Can approve/decline account officer announcement",
        "Can view complaints",
        "Can create inventory",
        "Can manage calendar",
        "Can create service provider",
        "Can check in and manage vehicle records",
        "Can approve and refund caution deposit",
      ],
    ],
  },
  {
    title: "staff configuration (account officer)",
    subTitle:
      "Can be accessed through mobile app, software, or web cross-platform.",
    permissions: [
      [
        "Can manage assigned tenants/occupants",
        "Can manage assigned properties",
        "Can view service provider",
        "Can create announcement",
        "Can add properties to branch",
        "Can view assigned request",
        "Can create branch inventory",
        "Can reply assigned messages",
        "Can check in and manage vehicle records",
      ],
      [
        "Can manage assigned landlord/landlady",
        "Can approve/decline assigned tasks",
        "Can view assigned account statement",
        "Can check in visitors",
        "Can check calendars",
        "Can create branch examine",
        "Can reply to inspections",
      ],
    ],
  },
  {
    title: "staff configuration (staff)",
    subTitle: "Can be accessed through mobile app or web cross-platform.",
    permissions: [
      [
        "Can be added to task",
        "Can view assigned complaints",
        "Can view announcement",
        "Can create examine",
        "Can reply to inspections",
        "Can view service provider",
        "Can check in vehicle records",
      ],
      [
        "Can check in visitors",
        "Can view assigned request",
        "Can create inventory",
        "Can reply assigned messages",
        "Can check calendars",
        "Can view and reply assigned messages",
      ],
    ],
  },
  // {
  //   title: "Users Configuration (Landlord, Occupant & Tenants)",
  //   subTitle: "Can be accessed through mobile app or web cross-platform.",
  //   permissions: [
  //     [
  //       "Create Profile Account For Tenants/Occupant",
  //       "Create Profile Account For Landlord/Landlady",
  //     ],
  //     [
  //       "Create Profile Account For Service Provider",
  //       "Create Profile Account When You Sent Invite",
  //     ],
  //   ],
  // },
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
    desc: "Description 1",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "weekly",
    label: "Weekly",
    desc: "Description 2",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "monthly",
    label: "Monthly",
    desc: "Description 3",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quarterly",
    label: "Quarterly",
    desc: "Description 4",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "yearly",
    label: "Yearly",
    desc: "Description 5",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "biennially",
    label: "Biennially",
    desc: "Description 6",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "triennially",
    label: "Triennially",
    desc: "Description 7",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quadrennial",
    label: "Quadrennial",
    desc: "Description 8",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "quinquennial",
    label: "Quinquennial",
    desc: "Description 9",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "sexennial",
    label: "Sexennial",
    desc: "Description 10",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "septennial",
    label: "Septennial",
    desc: "Description 11",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "octennial",
    label: "Octennial",
    desc: "Description 12",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "nonennial",
    label: "Nonennial",
    desc: "Description 13",
    options: PERCENTAGE_OPTIONS,
  },
  {
    value: "decennial",
    label: "Decennial",
    desc: "Description 14",
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
