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

export const actions = [
  { color: "#FF9800", label: "Start Rent" },
  { color: "#4CAF50", label: "Renew Rent" },
  { color: "#60A5FA ", label: "Edit" },
  { color: "#E9212E", label: "Move Out" },
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
