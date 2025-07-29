import { empty } from "@/app/config";
import type { Occupant, TenantResponse, UnitDetails } from "./types";
import type { Field } from "@/components/Table/types";
import dayjs, { Dayjs } from "dayjs";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

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
  console.log("data here- --", data);
  return {
    id: String(data.id) || "",
    name: data.name || "--- ---",
    email: data.email || "--- ---",
    userTag: (data.agent as "mobile" | "web") || "",
    avatar: data.picture || empty,
    gender: data.gender || "--- ---",
    birthday: "--- ---", //TODO - Add birthday
    phone: data.phone || "--- ---",
    maritalStatus: data.marital_status || "--- ---",
    tenant_type: data.tenant_type || "--- ---",
    family_type: data.Others.family_type || "--- ---",
    address: `${data.city || "__"}, ${data.local_government || "__"}, ${
      data.state || "__"
    }`,
    city: data.city || "--- ---",
    tier: data.user_tier || "--- ---",
    state: data.state || "--- ---",
    lg: data.local_government || "--- ---",
    occupation: data.Others.occupation || "--- ---",
    religion: data.religion || "--- ---", //TODO - Add religion
    nextOfKin: data.next_of_kin || {},
    tenant_signature: data.signature || "",
    badgeColor: data.user_tier
      ? tierColorMap[data?.user_tier as keyof typeof tierColorMap]
      : undefined,
  };
};

export const activeStatuses = [
  "vacant",
  "occupied",
  "active",
  "expired",
  "relocate",
];




export type Action = {
  color: string | ((propertyType: string) => string);
  label: string | ((propertyType: "rental" | "facility") => string);
  route?:
    | string
    | ((id: string, propertyType: "rental" | "facility", page?: string) => string);
  modal?: string;
};

// External function to determine route prefix based on page
const getRoutePrefix = (page?: string): string => {
  switch (page) {
    case "director":
      return "/management";
    case "manager":
      return "/manager/management";
    case "account":
      return "/accountant/management";
    case "staff":
      return "/staff/management";
    default:
      return "/unauthorized";
  }
};

export const actions: Action[] = [
  {
    color: "#FF9800",
    label: (propertyType) =>
      propertyType === "rental" ? "Start Rent" : "Move In",
    route: (id, propertyType, page) =>
      `${getRoutePrefix(page)}/rent-unit/${id}/start-rent?type=${propertyType}&id=${id}`,
  },
  {
    color: "#4CAF50",
    label: (propertyType) =>
      propertyType === "rental" ? "Renew Rent" : "Renew Fee",
    route: (id, propertyType, page) =>
      `${getRoutePrefix(page)}/rent-unit/${id}/renew-rent?type=${propertyType}&id=${id}`,
  },
  {
    color: (propertyType) =>
      propertyType === "rental" ? "#4CAF50" : "#0033C4",
    label: "Edit",
    route: (id, propertyType, page) =>
      `${getRoutePrefix(page)}/rent-unit/${id}/edit-rent?type=${propertyType}&id=${id}`,
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
  {
    color: "#FF9800",
    label: "Pending",
    modal: "Pending",
  },
];



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
  console.log("You see it here", estate_data);
  if (!estate_data) {
    return [
      { label: "Property Title", value: "-- --" },
      { label: "State", value: "-- --" },
      { label: "Local Government", value: "-- --" },
      { label: "Full Address", value: "-- --" },
      { label: "Branch", value: "-- --" },
      { label: "Account Officer", value: "-- --" },
      { label: "Description", value: "-- --" },
      { label: "Categories", value: "-- --" },
      { label: "Unit ID", value: "-- --" },
    ];
  }

  return [
    { label: "Property Title", value: estate_data.property_title ?? "-- --" },
    { label: "State", value: estate_data.property_state ?? "-- --" },
    {
      label: "Local Government",
      value: estate_data.localGovernment ?? "-- --",
    },
    { label: "Full Address", value: estate_data.property_address ?? "-- --" },
    { label: "Branch", value: estate_data.branchName ?? "-- --" },
    { label: "Account Officer", value: estate_data.accountOfficer ?? "-- --" },
    { label: "Description", value: estate_data.description ?? "-- --" },
    { label: "Categories", value: estate_data.categories ?? "-- --" },
    { label: "Unit ID", value: estate_data.unit_id ?? "-- --" },
  ];
};

export const getPropertyEstateData = (estate_data: any) => {
  console.log("estate_data passed down here you og", estate_data);
  if (!estate_data) {
    return [
      { label: "Property Title", value: "-- --" },
      { label: "State", value: "-- --" },
      { label: "Local Government", value: "-- --" },
      { label: "Full Address", value: "-- --" },
      { label: "Branch", value: "-- --" },
      { label: "Account Officer", value: "-- --" },
      { label: "Description", value: "-- --" },
      { label: "Categories", value: "-- --" },
      { label: "Unit ID", value: "-- --" },
    ];
  }

  return [
    { label: "Property Title", value: estate_data?.property_title ?? "-- --" },
    {
      label: "Full Address",
      value: `${estate_data?.address ?? "--- ---"}, ${
        estate_data?.localGovernment ?? "--- ---"
      }, ${estate_data?.state ?? "--- ---"},`,
    },
    { label: "Branch", value: estate_data.branchName ?? "-- --" },
    { label: "Account Officer", value: estate_data.accountOfficer ?? "-- --" },
    { label: "Description", value: estate_data.description ?? "-- --" },
    { label: "Categories", value: estate_data.categories ?? "-- --" },
    { label: "Unit ID", value: estate_data.id ?? "-- --" },
  ];
};

export const getEstateSettingsDta = (estate_data: any) => {
  if (!estate_data) {
    return [
      { label: "Management Fee", value: "-- --" },
      { label: "Period", value: "-- --" },
      { label: "Fee Penalty", value: "-- --" },
      { label: "Group Chat", value: "-- --" },
    ];
  }

  return [
    {
      label: "Management Fee",
      value: estate_data.management_fee
        ? `${estate_data.management_fee}%`
        : "-- --",
    },
    { label: "Period", value: estate_data.fee_period ?? "-- --" },
    { label: "Fee Penalty", value: estate_data.rent_penalty ?? "-- --" },
    { label: "Group Chat", value: estate_data.group_chat ?? "-- --" },
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
      label: "Rent",
      value: record.amount_paid || null,
    },
    // {
    //   label: "Other Fees",
    //   value: record.other_fees || "___",
    // },
  ];
}

// Helper: Capitalize the first letter (to ensure proper parsing)
function capitalizeDateString(dateStr: string): string {
  if (!dateStr) return dateStr;
  return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
}

// Helper: Convert a currency string like "$9,513,570.48" into a number (9513570.48)
function parseCurrency(amountStr: string): number {
  if (!amountStr || typeof amountStr !== "string") return 0;
  // Remove currency symbols (₦, $, £, €, ¥) and commas, keep decimal point
  const cleaned = amountStr.replace(/^[₦$£€¥]+|,/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateBalance(
  amount_paid: string,
  start_date: string,
  due_date: string
): number {
  const amount = parseCurrency(amount_paid);
  const start = dayjs(capitalizeDateString(start_date));
  const due = dayjs(capitalizeDateString(due_date));
  const today = dayjs();

  const totalDays = due.diff(start, "day");
  if (totalDays <= 0) return 0;

  // Clamp today's date between start and due
  const effectiveEnd = today.isBefore(start)
    ? start
    : today.isAfter(due)
    ? due
    : today;

  const daysSpent = effectiveEnd.diff(start, "day");

  // Cost per day
  const costPerDay = amount / totalDays;

  // Rent consumed so far
  const consumed = costPerDay * daysSpent;

  // Balance left = amount paid - consumed rent
  return Math.round(amount - consumed);
}

export function calculateOutstandingBalance(
  rent: string, // newTenantTotalPrice for the last record
  records: any[], // Array of records with start_date and due_date
  renewalTenantTotalPrice?: any // Renewal total price for other records
): number {
  const newTenantPrice = parseCurrency(rent);

  const renewalPrice = parseCurrency(renewalTenantTotalPrice || rent);
  const today = dayjs();

  // Filter valid records
  const validRecords = records.filter((rec) => rec.start_date && rec.due_date);
  if (!validRecords.length) return 0;

  // Check if the earliest period is past
  const earliestRecord = validRecords.reduce((min, rec) =>
    dayjs(rec.start_date).isBefore(dayjs(min.start_date)) ? rec : min
  );
  const isEarliestPast = dayjs(earliestRecord.due_date).isBefore(today);

  // Calculate total expected rent
  let totalExpectedRent = 0;
  if (isEarliestPast || validRecords.length === 1) {
    totalExpectedRent = renewalPrice * validRecords.length;
  } else {
    totalExpectedRent =
      renewalPrice * (validRecords.length - 1) + newTenantPrice;
  }

  let totalDaysPaidFor = 0;
  let totalDaysSpent = 0;

  validRecords.forEach((record) => {
    const start = dayjs(record.start_date);
    const due = dayjs(record.due_date);

    // Calculate total days in the period
    const daysInPeriod = due.diff(start, "day");
    if (daysInPeriod <= 0) return;

    totalDaysPaidFor += daysInPeriod;

    // Calculate days spent
    const daysSpent = today.isBefore(start)
      ? 0
      : today.isBefore(due)
      ? today.diff(start, "day")
      : daysInPeriod;

    totalDaysSpent += daysSpent;
  });

  // Calculate daily rate and consumed rent
  const dailyRate =
    totalDaysPaidFor > 0 ? totalExpectedRent / totalDaysPaidFor : 0;
  const consumedRent = dailyRate * totalDaysSpent;

  return totalExpectedRent - consumedRent;
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
  { id: "3", label: "Rent Amount", accessor: "rent_amount" },
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

// export const calculateDueDate = (
//   startDate: Dayjs,
//   rentPeriod: RentPeriod
// ): Dayjs => {
//   switch (rentPeriod) {
//     case "daily":
//       return startDate.add(1, "day");
//     case "weekly":
//       return startDate.add(1, "week");
//     case "monthly":
//       return startDate.add(1, "month");
//     case "quarterly":
//       return startDate.add(3, "month");
//     case "yearly":
//       return startDate.add(1, "year");
//     case "biennially":
//       return startDate.add(2, "year");
//     case "triennially":
//       return startDate.add(3, "year");
//     case "quadrennial":
//       return startDate.add(4, "year");
//     case "quinquennial":
//       return startDate.add(5, "year");
//     case "sexennial":
//       return startDate.add(6, "year");
//     case "septennial":
//       return startDate.add(7, "year");
//     case "octennial":
//       return startDate.add(8, "year");
//     case "nonennial":
//       return startDate.add(9, "year");
//     case "decennial":
//       return startDate.add(10, "year");
//     default:
//       return startDate.add(1, "month");
//   }
// };

// NOW WE'RE REMOVING 1 DAY

export const calculateDueDate = (
  startDate: Dayjs,
  rentPeriod: RentPeriod
): Dayjs => {
  switch (rentPeriod) {
    case "daily":
      return startDate.add(1, "day").subtract(1, "day");
    case "weekly":
      return startDate.add(1, "week").subtract(1, "day");
    case "monthly":
      return startDate.add(1, "month").subtract(1, "day");
    case "quarterly":
      return startDate.add(3, "month").subtract(1, "day");
    case "yearly":
      return startDate.add(1, "year").subtract(1, "day");
    case "biennially":
      return startDate.add(2, "year").subtract(1, "day");
    case "triennially":
      return startDate.add(3, "year").subtract(1, "day");
    case "quadrennial":
      return startDate.add(4, "year").subtract(1, "day");
    case "quinquennial":
      return startDate.add(5, "year").subtract(1, "day");
    case "sexennial":
      return startDate.add(6, "year").subtract(1, "day");
    case "septennial":
      return startDate.add(7, "year").subtract(1, "day");
    case "octennial":
      return startDate.add(8, "year").subtract(1, "day");
    case "nonennial":
      return startDate.add(9, "year").subtract(1, "day");
    case "decennial":
      return startDate.add(10, "year").subtract(1, "day");
    default:
      return startDate.add(1, "month").subtract(1, "day");
  }
};

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
      // const name = `${baseName} ${index + 1}`;
      const name = file.name ?? `${baseName} ${index + 1}`;
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

export const isValidValue = (value: string | undefined | null): boolean => {
  return (
    value != null &&
    typeof value === "string" &&
    value.trim() !== "" &&
    value !== "--- ---" &&
    value !== "--" &&
    value !== "---" &&
    value !== "__, __, __" &&
    value !== "__,__,__"
  );
};
export const capitalizeEachWord = (str?: string): string => {
  if (!str || !isValidValue(str)) return "";
  return str
    .toLowerCase()
    .split(" ")
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
