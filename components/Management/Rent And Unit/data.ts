import { empty } from "@/app/config";
import type { Occupant, TenantResponse, UnitDetails } from "./types";
import type { Field } from "@/components/Table/types";
import dayjs, { Dayjs } from "dayjs";

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

export const transformTenantData = (res: TenantResponse): Occupant => {
  const { data } = res;
  return {
    id: String(data.id) || "",
    name: data.name || "--- ---",
    email: data.email || "--- ---",
    userTag: (data.agent as "mobile" | "web") || "",
    avatar: data.picture || empty,
    gender: data.gender || "--- ---",
    birthday: "--- ---", //TODO - Add birthday
    phone: data.phone || "--- ---",
    maritalStatus: data.tenant_type || "--- ---",
    address:
      `${data.city || "__"}, ${data.local_government || "__"}, ${
        data.state || "__"
      }`,
    city: data.city || "--- ---",
    state: data.state || "--- ---",
    lg: data.local_government || "--- ---",
    religion: "--- ---", //TODO - Add religion
  };
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
      `/management/rent-unit/${id}/start-rent?type=${propertyType}&id=${id}`,
  },

  {
    color: "#4CAF50",
    label: (propertyType) =>
      propertyType === "rental" ? "Renew Rent" : "Renew Fee",
    route: (id, propertyType) =>
      `/management/rent-unit/${id}/renew-rent?type=${propertyType}&id=${id}`,
  },
  {
    color: "#60A5FA",
    label: "Edit",
    route: (id, propertyType) =>
      `/management/rent-unit/${id}/edit-rent?type=${propertyType}&id=${id}`,
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
// export const unitDetails: UnitDetails = {
//   title: "Newly Built 5 Bedroom Duplex",
//   location: "Street 23, All Avenue, Nigeria",
//   categories: "Residential",
//   unitNumber: "Harmony Cottage",
//   unitPreference: "Newly Built",
//   unitType: "Flat",
//   unitSubType: "Twin Flat",
//   state: "Oyo",
//   localGovernment: "Ibadan North",
//   accountOfficer: "Sunday Ogunwole",
//   bedrooms: 8,
//   bathrooms: 4,
//   toilets: 4,
//   newTenantPrice: 1950000,
//   renewalTenantPrice: 1950000,
//   images: [
//     "/empty/SampleProperty.jpeg",
//     "/empty/SampleProperty2.jpeg",
//     "/empty/SampleProperty3.jpeg",
//     "/empty/SampleProperty4.png",
//     "/empty/SampleProperty5.jpg",
//   ],
// };

export interface CheckBoxOptions {
  mobile_notification: boolean;
  email_alert: boolean;
  create_invoice: boolean;
  sms_alert: boolean;
  rent_agreement?: boolean;
}

export const defaultChecks: CheckBoxOptions = {
  mobile_notification: true,
  email_alert: true,
  create_invoice: true,
  sms_alert: true,
  rent_agreement: false,
};

export const getEstateData = (estate_data: any) => {
  return [
    { label: "Property Title", value: estate_data.property_title ?? "-- --" },
    { label: "State", value: estate_data.property_state ?? "-- -- " },
    {
      label: "Local Government",
      value: estate_data.localGovernment ?? "-- -- ",
    },
    { label: "Full Address", value: estate_data.property_address ?? "-- --" },
    { label: "Branch", value: estate_data.branchName ?? "-- --" },
    { label: "Account Officer", value: estate_data.accountOfficer ?? "-- --" },
    { label: "Description", value: estate_data.description ?? "-- -- " },
    { label: "Categories", value: estate_data.categories ?? "-- --" },
    { label: "Unit ID", value: estate_data.unit_id ?? "-- --" },
  ];
};

export const estateData = [
  { label: "Property Title", value: "Golden Estate" },
  { label: "State", value: "Oyo State" },
  { label: "Local Government", value: "Akinyele" },
  { label: "Full Address", value: "56, Abiola way area Moniya ibadan" },
  { label: "Branch", value: "Moniya Branch" },
  { label: "Account Officer", value: "Ajadi David" },
  {
    label: "Description",
    value:
      "Lorem ipsum dolor sit amet, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
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

export interface RentPreviousRecords {
  amount_paid: string;
  due_date: string;
  start_date: string;
  other_fees: string;
}
export const initialPreviousRecords = [
  {
    amount_paid: "",
    due_date: "",
    start_date: "",
    other_fees: "",
  },
];

export function getRenewalRentDetailItems(
  records: Array<RentPreviousRecords>
): Array<{ label: string; value: string | null }> {
  if (!records || records.length === 0) return [];

  // Using the first record from the passed data
  const record = records[0];

  return [
    {
      label: "Start Date",
      value: record.start_date
        ? dayjs(record.start_date).format("MMM D, YYYY")
        : null,
    },
    {
      label: "Due Date",
      value: record.due_date
        ? dayjs(record.due_date).format("MMM D, YYYY")
        : null,
    },
    {
      label: "Annual Rent",
      value: record.amount_paid || null,
    },
    {
      label: "Other Fees",
      value: record.other_fees || "___",
    },
  ];
}

// Helper: Capitalize the first letter (to ensure proper parsing)
function capitalizeDateString(dateStr: string): string {
  if (!dateStr) return dateStr;
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

// Helper: Convert a currency string like "₦30,000" into a number (30000)
function parseCurrency(amountStr: string): number {
  if (!amountStr) return 0;
  return Number(amountStr.replace(/[₦,]/g, ""));
}

export function calculateBalance(
  amount_paid: string,
  start_date: string,
  due_date: string
): number {
  const amount = parseCurrency(amount_paid);
  // Ensure the month name is capitalized for proper parsing
  const start = dayjs(capitalizeDateString(start_date));
  const due = dayjs(capitalizeDateString(due_date));

  const totalDays = due.diff(start, "day");
  const remainingDays = due.diff(dayjs(), "day");

  if (totalDays <= 0) return 0;

  // Ratio of remaining days over total days
  const ratio = remainingDays / totalDays;
  // return amount * ratio;
  return Math.round(amount * ratio);
}

// Simple debounce function to prevent rapid calls to fetch
export const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
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

// export const sampleDocuments = [
//   {
//     id: "1",
//     name: "Invoice 1",
//     link: "https://example.com/sample-attachment.pdf",
//     date: "2021-01-01",
//     thumbnail: "/empty/SampleLandlord.jpeg",
//     document_type: "invoice",
//   },
//   {
//     id: "2",
//     name: "Invoice 2",
//     link: "https://example.com/sample-attachment.pdf",
//     date: "2021-01-01",
//     thumbnail: "/empty/SampleLandlord2.svg",
//     document_type: "invoice",
//   },
//   {
//     id: "3",
//     name: "Receipt 1",
//     link: "https://example.com/sample-attachment.pdf",
//     date: "2021-01-01",
//     thumbnail: "/empty/SampleLogo.jpeg",
//     document_type: "receipt",
//   },
//   {
//     id: "4",
//     name: "Receipt 2",
//     link: "https://example.com/sample-attachment.pdf",
//     date: "2021-01-01",
//     thumbnail: "/empty/SampleProperty.jpeg",
//     document_type: "receipt",
//   },

//   {
//     id: "5",
//     name: "Classified MI6 Info",
//     link: "https://example.com/sample-attachment.pdf",
//     date: "2021-01-01",
//     document_type: "other document",
//   },
//   {
//     id: "6",
//     name: "Highly Classified FBI Database",
//     link: "https://example.com/sample-attachment.pdf",
//     date: "2021-01-01",
//     document_type: "other document",
//   },
// ];

export const transformDocuments = (docs: any) => {
  return docs.flatMap((doc: any) => {
    const baseId = String(doc.id);
    const typeFormatted = doc.type.charAt(0).toUpperCase() + doc.type.slice(1);
    const baseName = `${typeFormatted}`;
    const date = doc.created_at ? doc.created_at.substring(0, 10) : "";
    // Use the thumbnail if provided, otherwise default to an empty string
    const thumbnail = doc.thumbnail || "";

    // For each file in the files array, create a transformed object.
    return doc.files.map((file: any, index: number) => {
      // For the first file, use the base name. For subsequent files, append plus signs.
      const name = `${baseName} ${index + 1}`;
      const link = file.url || "";
      return {
        id: baseId,
        name,
        link,
        date,
        thumbnail,
        document_type: doc.type,
      };
    });
  });
};
