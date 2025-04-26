import dayjs from "dayjs";
import {
  calculateBalance,
  RentPeriod,
} from "@/components/Management/Rent And Unit/data";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";

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

// Map RentPeriod to period length in days (for cost calculation)
const periodToDays = (period: RentPeriod): number => {
  switch (period) {
    case "daily":
      return 1;
    case "weekly":
      return 7;
    case "monthly":
      return 30.42; // Average days per month (365 / 12)
    case "quarterly":
      return 91.25; // Average days per quarter (365 / 4)
    case "yearly":
      return 365;
    case "biennially":
      return 365 * 2;
    case "triennially":
      return 365 * 3;
    case "quadrennial":
      return 365 * 4;
    case "quinquennial":
      return 365 * 5;
    case "sexennial":
      return 365 * 6;
    case "septennial":
      return 365 * 7;
    case "octennial":
      return 365 * 8;
    case "nonennial":
      return 365 * 9;
    case "decennial":
      return 365 * 10;
    default:
      return 30.42; // Fallback to monthly
  }
};

// Helper function to calculate duration and breakdown
export const getBalanceBreakdown = (
  record: any,
  period: RentPeriod,
  currencySymbol: string
) => {
  if (!record.start_date || !record.due_date || !period) {
    return {
      duration: "-",
      breakdown: [
        { label: "Error", value: "Missing start date, due date, or period" },
      ],
    };
  }

  const startDate = dayjs(record.start_date);
  const dueDate = dayjs(record.due_date);
  const currentDate = dayjs();
  const endDate = dueDate.isAfter(currentDate) ? currentDate : dueDate;

  // Calculate duration in days
  const daysSpent = endDate.diff(startDate, "day");
  const durationText = `${daysSpent} day${daysSpent !== 1 ? "s" : ""}`;

  // Calculate overdue periods
  const overduePeriods = calculateOverduePeriods(
    dueDate.format("DD/MM/YYYY"),
    period
  );

  // Parse amount_paid (remove currency symbol if present)
  const amountPaid = parseFloat(
    record.amount_paid?.replace(currencySymbol, "") || "0"
  );

  // Calculate cost per period (assume amount_paid is the rent for the full period)
  const periodDays = periodToDays(period);
  const costPerDay = amountPaid / periodDays;

  // Calculate expected rent for days spent
  const totalExpectedRent = costPerDay * daysSpent;

  // Calculate outstanding balance
  const outstanding = calculateBalance(
    record.amount_paid,
    record.start_date,
    record.due_date
  );

  const breakdown = [
    {
      label: "Occupancy Period",
      value: `${startDate.format("MMM D, YYYY")} - ${endDate.format(
        "MMM D, YYYY"
      )}`,
    },
    {
      label: "You spent",
      value: durationText,
    },
    {
      label: `Cost per Day (${period})`,
      value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
    },
    {
      label: "We Deduct",
      value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
    },
    {
      label: "You paid",
      value: record.amount_paid || `${currencySymbol}0`,
    },
    ...(overduePeriods > 0
      ? [
          {
            label: "Overdue Periods",
            value: `${overduePeriods} ${period}`,
          },
        ]
      : []),
    {
      label: "Your balance",
      value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
    },
  ];

  return { duration: durationText, breakdown };
};

// const periodToDays = (period: RentPeriod): number => {
//   switch (period) {
//     case "daily":
//       return 1;
//     case "weekly":
//       return 7;
//     case "monthly":
//       return 30.42; // Average days per month
//     case "quarterly":
//       return 91.25; // Average days per quarter
//     case "yearly":
//       return 365;
//     case "biennially":
//       return 365 * 2;
//     case "triennially":
//       return 365 * 3;
//     case "quadrennial":
//       return 365 * 4;
//     case "quinquennial":
//       return 365 * 5;
//     case "sexennial":
//       return 365 * 6;
//     case "septennial":
//       return 365 * 7;
//     case "octennial":
//       return 365 * 8;
//     case "nonennial":
//       return 365 * 9;
//     case "decennial":
//       return 365 * 10;
//     default:
//       return 30.42; // Fallback
//   }
// };

// Breakdown for overdue periods and netOwing

export const getOwingBreakdown = (
  dueDate: string,
  period: RentPeriod,
  totalPackage: number,
  outstandingBalance: number,
  baseCost: number,
  calculation: boolean,
  deduction: boolean,
  currencySymbol: string
) => {
  if (!dueDate || !period) {
    return {
      overdueBreakdown: [
        { label: "Error", value: "Missing due date or period" },
      ],
      netOwingBreakdown: [{ label: "Error", value: "Missing required data" }],
    };
  }

  const now = dayjs();
  const due = dayjs(dueDate, "DD/MM/YYYY");
  const overduePeriods = calculateOverduePeriods(dueDate, period);
  const periodCost = totalPackage; // Cost per period (e.g., annual rent for yearly)
  const owingAmount = overduePeriods * periodCost;

  // Overdue breakdown
  const overdueBreakdown = [
    {
      label: "Due Date",
      value: due.format("MMM D, YYYY"),
    },
    {
      label: "Overdue Periods",
      value: overduePeriods > 0 ? `${overduePeriods} ${period}` : "None",
    },
    {
      label: `Cost per ${period}`,
      value: `${currencySymbol}${formatNumber(periodCost)}`,
    },
    {
      label: "Owing Amount",
      value:
        owingAmount > 0
          ? `${currencySymbol}${formatNumber(owingAmount)}`
          : `${currencySymbol}0`,
    },
  ];

  // Net owing breakdown
  const netOwing = deduction ? outstandingBalance - baseCost : baseCost;
  const netOwingBreakdown = [
    {
      label: "Previous Unit Balance",
      value: `${currencySymbol}${formatNumber(Math.abs(outstandingBalance))}`,
    },
    {
      label: calculation ? "New Tenant Cost" : "Renewal Tenant Cost",
      value: `${currencySymbol}${formatNumber(baseCost)}`,
    },
    {
      label: "Deduction Applied",
      value: deduction ? "Yes" : "No",
    },
    {
      label: netOwing >= 0 ? "Amount Owed" : "Refund Due",
      value: `${currencySymbol}${formatNumber(Math.abs(netOwing))}`,
    },
  ];

  return { overdueBreakdown, netOwingBreakdown };
};
