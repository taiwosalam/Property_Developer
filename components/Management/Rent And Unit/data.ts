import { UnitDetails } from "./types";

export const getBackgroundColor = (StatusName: string): string => {
  switch (StatusName) {
    case "vacant":
      return "#FFBB53";
    case "occupied":
      return "#01BA4C";
    case "active":
      return "#0033C4";
    case "expired":
      return "#E9212E";
    case "relocate":
      return "#620E13";
    default:
      return "#000";
  }
};

export const activeStatuses = [
  "vacant",
  "occupied",
  "active",
  "expired",
  "relocate",
];

type Action = {
  color: string;
  label: string | ((propertyType: "rental" | "facility") => string);
  route?: string | ((id: string) => string);
  modal?: string;
};

export const actions: Action[] = [
  {
    color: "#FF9800",
    label: (propertyType) =>
      propertyType === "rental" ? "Start Rent" : "Start Counting",
    route: (id) => `/management/rent-unit/${id}/start-rent`,
  },

  {
    color: "#4CAF50",
    label: (propertyType) =>
      propertyType === "rental" ? "Renew Rent" : "Renew Fee",
    route: (id) => `/management/rent-unit/${id}/renew-rent`,
  },
  {
    color: "#60A5FA",
    label: "Edit",
    route: (id) => `/management/rent-unit/${id}/edit-rent`,
  },
  {
    color: "#E9212E",
    label: "Move Out",
    modal: "Move Out",
  },
  {
    color: "#620E13",
    label: "Relocate",
    modal: "Relocate",
  },
];

// This would typically come from an API or props
export const unitDetails: UnitDetails = {
  title: "Newly Built 5 Bedroom Duplex",
  location: "Street 23, All Avenue, Nigeria",
  categories: "Residential",
  unitNumber: "Harmony Cottage",
  unitPreference: "Newly Built",
  unitType: "Flat",
  unitSubType: "Twin Flat",
  state: "Oyo",
  localGovernment: "Ibadan North",
  accountOfficer: "Sunday Ogunwole",
  bedrooms: 8,
  bathrooms: 4,
  toilets: 4,
  newTenantPrice: 1950000,
  renewalTenantPrice: 1950000,
  images: [
    "/empty/SampleProperty.jpeg",
    "/empty/SampleProperty2.jpeg",
    "/empty/SampleProperty3.jpeg",
    "/empty/SampleProperty4.png",
    "/empty/SampleProperty5.jpg",
  ],
};

export const estateData = [
  { label: "Property Title", value: "Golden Estate" },
  { label: "State", value: "Oyo State" },
  { label: "Local Government", value: "Akinyele" },
  { label: "Full Address", value: "56, Abiola way area Moniya ibadan" },
  { label: "Branch", value: "Moniya Branch" },
  { label: "Account Officer", value: "Ajadi David" },
  { label: "Description", value: "Lorem ipsum dolor sit amet, consecte....." },
  { label: "Categories", value: "Residential" },
];

export const estateSettingsDta = [
  { label: "Management Fee", value: "10%" },
  { label: "Period", value: "Annually" },
  { label: "Fee Penalty", value: "Yes" },
  { label: "Group Chat", value: "Yes" },
];
