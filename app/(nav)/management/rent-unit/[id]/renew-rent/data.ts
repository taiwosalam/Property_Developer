import dayjs from "dayjs";
import { RentPeriod } from "@/components/Management/Rent And Unit/data";

export const getPropertySettingsData = (unit_data: any) => [
  { label: "Agency Fee", value: `${unit_data?.agency_fee}%` || "____" },
  { label: "Period", value: unit_data?.fee_period || "____" },
  { label: "Charge", value: unit_data?.whoToCharge || "____" },
  { label: "Caution Deposit", value: unit_data?.caution_deposit || "____" },
  { label: "Group Chat", value: `${unit_data?.group_chat}` || "____" },
  { label: "Rent Penalty", value: `${unit_data?.rent_penalty}` },
];

export const getRentalData = (unit_data: any) => [
  { label: "Property Title", value: unit_data?.title || "____" },
  { label: "State", value: unit_data?.state || "____" },
  { label: "Local Government", value: unit_data?.localGovernment || "____" },
  { label: "Full Address", value: unit_data?.address || "____" },
  { label: "Branch", value: unit_data?.branchName || "___" },
  { label: "Account Officer", value: unit_data.account_officer || "____" }, // TODO: Replace dynamically if available
  { label: "Landlord", value: unit_data.landlord || "___" }, // TODO: Replace dynamically if available
  { label: "Categories", value: unit_data?.categories || "____" },
  { label: "Unit ID", value: unit_data?.unit_id || "____" },
];

export const calculateOverduePeriods = (
  dueDate: string,
  period: RentPeriod
): number => {
  const now = dayjs();
  const due = dayjs(dueDate, "DD/MM/YYYY");
  // Log the date comparison
  if (now.isBefore(due)) {
    return 0;
  }

  switch (period) {
    case "daily":
      return now.diff(due, "day");
    case "weekly":
      return now.diff(due, "week");
    case "monthly":
      return now.diff(due, "month");
    case "quarterly":
      return now.diff(due, "quarter");
    case "yearly":
      return now.diff(due, "year");
    case "biennially":
      return Math.floor(now.diff(due, "year") / 2);
    case "triennially":
      return Math.floor(now.diff(due, "year") / 3);
    case "quadrennial":
      return Math.floor(now.diff(due, "year") / 4);
    case "quinquennial":
      return Math.floor(now.diff(due, "year") / 5);
    case "sexennial":
      return Math.floor(now.diff(due, "year") / 6);
    case "septennial":
      return Math.floor(now.diff(due, "year") / 7);
    case "octennial":
      return Math.floor(now.diff(due, "year") / 8);
    case "nonennial":
      return Math.floor(now.diff(due, "year") / 9);
    case "decennial":
      return Math.floor(now.diff(due, "year") / 10);
    default:
      return 0;
  }
};

// Format the owing period for display (e.g., "2 days", "3 months")
export const formatOwingPeriod = (
  periods: number,
  periodType: RentPeriod
): string => {
  const pluralize = (count: number, noun: string) =>
    `${count} ${noun}${count !== 1 ? "s" : ""}`;
  switch (periodType) {
    case "daily":
      return pluralize(periods, "day");
    case "weekly":
      return pluralize(periods, "week");
    case "monthly":
      return pluralize(periods, "month");
    case "quarterly":
      return pluralize(periods, "quarter");
    case "yearly":
      return pluralize(periods, "year");
    case "biennially":
      return pluralize(periods, "biennium");
    case "triennially":
      return pluralize(periods, "triennium");
    case "quadrennial":
      return pluralize(periods, "quadrennium");
    case "quinquennial":
      return pluralize(periods, "quinquennium");
    case "sexennial":
      return pluralize(periods, "sexennium");
    case "septennial":
      return pluralize(periods, "septennium");
    case "octennial":
      return pluralize(periods, "octennium");
    case "nonennial":
      return pluralize(periods, "nonennium");
    case "decennial":
      return pluralize(periods, "decennium");
    default:
      return `${periods} periods`;
  }
};
