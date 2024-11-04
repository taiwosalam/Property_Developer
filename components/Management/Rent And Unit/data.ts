import type { Occupant, UnitDetails } from "./types";
import type { Field } from "@/components/Table/types";
import { Dayjs } from "dayjs";

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
  route?:
    | string
    | ((id: string, propertyType: "rental" | "facility") => string);
  modal?: string;
};

export const actions: Action[] = [
  {
    color: "#FF9800",
    label: (propertyType) =>
      propertyType === "rental" ? "Start Rent" : "Start Counting",
    route: (id, propertyType) =>
      `/management/rent-unit/${id}/start-rent?type=${propertyType}`,
  },

  {
    color: "#4CAF50",
    label: (propertyType) =>
      propertyType === "rental" ? "Renew Rent" : "Renew Fee",
    route: (id, propertyType) =>
      `/management/rent-unit/${id}/renew-rent?type=${propertyType}`,
  },
  {
    color: "#60A5FA",
    label: "Edit",
    route: (id, propertyType) =>
      `/management/rent-unit/${id}/edit-rent?type=${propertyType}`,
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
  { label: "Unit ID", value: "123456" },
];

export const rentalData = [
  { label: "Property Title", value: "Golden Estate" },
  { label: "State", value: "Oyo State" },
  { label: "Local Government", value: "Akinyele" },
  { label: "Full Address", value: "56, Abiola way area Moniya ibadan" },
  { label: "Branch", value: "Moniya Branch" },
  { label: "Account Officer", value: "Ajadi David" },
  { label: "Landlord", value: "Akintunde Jowo" },
  { label: "Categories", value: "Residential" },
  { label: "Unit ID", value: "123456" },
];

export const estateSettingsDta = [
  { label: "Management Fee", value: "10%" },
  { label: "Period", value: "Annually" },
  { label: "Fee Penalty", value: "Yes" },
  { label: "Group Chat", value: "Yes" },
];

export const propertySettingsData = [
  { label: "Agency Fee", value: "10%" },
  { label: "Period", value: "Annually" },
  { label: "Charge", value: "Tenant" },
  { label: "Caution Deposit", value: "Escrow It" },
  { label: "Group Chat", value: "Yes" },
  { label: "Rent Penalty", value: "Yes" },
];

export const DUMMY_OCCUPANT: Occupant = {
  name: "Abimbola Adedeji",
  email: "abimbola@gmail.com",
  avatar: "/empty/avatar-1.svg",
  gender: "Male",
  birthday: "12/12/12",
  religion: "Christianity",
  phone: "+2348132086958",
  maritalStatus: "Single",
  address: "U4 Joke Plaza Bodija Ibadan",
  city: "Ibadan",
  state: "Oyo State",
  lg: "Ibadan North Central",
  userTag: "mobile",
  id: "123",
};

export const renewalRentDetailItems = [
  { label: "Current Start Date", value: "12/1/2023" },
  { label: "Due Date", value: "12/1/2023" },
  { label: "Annual Rent", value: "₦300,000" },
  { label: "Other Fees", value: "₦300,000" },
];

export const previousRentRecordsTableFields: Field[] = [
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Payment Date", accessor: "payment_date" },
  { id: "3", label: "Amount Paid", accessor: "amount_paid" },
  { id: "4", label: "Details", accessor: "details" },
  { id: "5", label: "Start Date", accessor: "start_date" },
  { id: "6", label: "Due Date", accessor: "due_date" },
];

const generateTableData = (length: number) => {
  return Array.from({ length }, (_, index) => ({
    id: index + 1,
    payment_date: "12/1/2023",
    amount_paid: "₦300,000",
    details: "New Rent",
    start_date: "12/1/2023",
    due_date: "12/1/2023",
  }));
};

export const previousRentRecordsData = generateTableData(5);

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

export const calculateDueDate = (
  startDate: Dayjs,
  rentPeriod: RentPeriod
): Dayjs => {
  switch (rentPeriod) {
    case "daily":
      return startDate.add(1, "day");
    case "weekly":
      return startDate.add(1, "week");
    case "monthly":
      return startDate.add(1, "month");
    case "quarterly":
      return startDate.add(3, "month");
    case "yearly":
      return startDate.add(1, "year");
    case "biennially":
      return startDate.add(2, "year");
    case "triennially":
      return startDate.add(3, "year");
    case "quadrennial":
      return startDate.add(4, "year");
    case "quinquennial":
      return startDate.add(5, "year");
    case "sexennial":
      return startDate.add(6, "year");
    case "septennial":
      return startDate.add(7, "year");
    case "octennial":
      return startDate.add(8, "year");
    case "nonennial":
      return startDate.add(9, "year");
    case "decennial":
      return startDate.add(10, "year");
    default:
      return startDate.add(1, "month");
  }
};
