import dayjs from "dayjs";
import {
  calculateBalance,
  calculateOutstandingBalance,
  RentPeriod,
} from "@/components/Management/Rent And Unit/data";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";

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

// export const getBalanceBreakdown = (
//   rent: any,
//   record: any,
//   records: any[],
//   period: RentPeriod | undefined,
//   currencySymbol: string
// ) => {
//   // Validate required fields
//   if (!record.start_date || !record.due_date) {
//     return {
//       duration: "-",
//       breakdown: [{ label: "Error", value: "Missing start date or due date" }],
//     };
//   }

//   const startDate = dayjs(record.start_date);
//   const dueDate = dayjs(record.due_date);
//   const currentDate = dayjs();

//   // Parse amount_paid (remove currency symbol if present)
//   const amountPaid = parseCurrency(rent);

//   let totalDaysSpent = 0;
//   let totalExpectedRent = 0;
//   let totalOutstanding = 0;

//   const breakdown: { label: string; value: string }[] = [];
//   const prevUBreakdown: { label: string; value: string }[] = [];
//   const oustandingObj: { label: string; value: string }[] = [];

//   // Iterate over records array
//   records.forEach((rec) => {
//     const recStartDate = dayjs(rec.start_date);
//     const recDueDate = dayjs(rec.due_date);
//     const amountPaidRec = parseCurrency(rec.amount_paid);

//     // Calculate days spent for the current record
//     const endDate = recDueDate.isAfter(currentDate) ? currentDate : recDueDate;
//     const daysSpent = Math.max(0, endDate.diff(recStartDate, "day"));
//     totalDaysSpent += daysSpent;

//     const periodDays = periodToDays(period);
//     const costPerDay = amountPaidRec / periodDays;
//     const expectedRent = costPerDay * daysSpent;
//     totalExpectedRent += expectedRent;

//     // Calculate outstanding balance
//     const outstanding = calculateOutstandingBalance(rent, records);

//     totalOutstanding += outstanding;

//     // Add record details to the breakdown
//     breakdown.push(
//       {
//         label: `Occupancy Period for ${rec.title}`,
//         value: currentDate.isBefore(recStartDate)
//           ? "Not started"
//           : `${recStartDate.format("MMM D, YYYY")} - ${endDate.format("MMM D, YYYY")}`,
//       },
//       {
//         label: `You spent for ${rec.title}`,
//         value: `${daysSpent} day${daysSpent !== 1 ? "s" : ""}`,
//       },
//       {
//         label: `Cost per Day for ${rec.title}`,
//         value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
//       },
//       {
//         label: `We Deduct for ${rec.title}`,
//         value: `${currencySymbol}${formatNumber(expectedRent.toFixed(2))}`,
//       },
//       {
//         label: `You paid for ${rec.title}`,
//         value: rec.amount_paid || `${currencySymbol}0`,
//       }
//     );

//     // Add previous usage breakdown (for the summary)
//     prevUBreakdown.push(
//       {
//         label: `Rent Consumed for ${rec.title}`,
//         value: `${currencySymbol}${formatNumber(expectedRent.toFixed(2))}`,
//       },
//       {
//         label: `Outstanding Rent for ${rec.title}`,
//         value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//       }
//     );
//   });

//   // Aggregate total outstanding rent
//   oustandingObj.push({
//     label: "Total Outstanding Rent",
//     value: `${currencySymbol}${formatNumber(Math.abs(totalOutstanding))}`,
//   });

//   // Calculate duration (days spent)
//   let durationText = `${totalDaysSpent} day${totalDaysSpent !== 1 ? "s" : ""}`;

//   return {
//     duration: durationText,
//     breakdown,
//     prevUBreakdown,
//     oustandingObj,
//   };
// };

export const getBalanceBreakdown = (
  rent: any, // newTenantTotalPrice for the last record (initial payment)
  record: any, // Primary record for context (not used)
  records: any[], // Array of records with start_date and due_date
  period: RentPeriod | undefined, // Optional period for period-based calculations
  currencySymbol: string,
  renewalTenantTotalPrice?: any // Renewal total price for other records
) => {
  console.log("renewalTenantTotalPrice", renewalTenantTotalPrice);
  console.log("rent", rent);
  console.log("records", records);
  // Validate inputs
  if (
    !records.length ||
    records.every((rec) => !rec.start_date || !rec.due_date)
  ) {
    return {
      duration: "-",
      breakdown: [{ label: "Error", value: "No valid records provided" }],
      prevUBreakdown: [],
      oustandingObj: [],
    };
  }

  const currentDate = dayjs();
  const newTenantPrice = parseCurrency(rent); // Parse new tenant price (for last record)
  const renewalPrice = parseCurrency(renewalTenantTotalPrice || rent); // Parse renewal price, fallback to rent

  // Filter valid records
  const validRecords = records.filter((rec) => rec.start_date && rec.due_date);
  if (!validRecords.length) {
    return {
      duration: "-",
      breakdown: [{ label: "Error", value: "No valid records provided" }],
      prevUBreakdown: [],
      oustandingObj: [],
    };
  }

  const earliestRecord = validRecords.reduce((min, rec) =>
    dayjs(rec.start_date).isBefore(dayjs(min.start_date)) ? rec : min
  );
  const isEarliestPast = dayjs(earliestRecord.due_date).isBefore(currentDate);

  // Calculate total expected rent and components
  let totalExpectedRent = 0;
  let initialRent = 0;
  let renewalRent = 0;
  if (validRecords.length === 1) {
    initialRent = newTenantPrice;
    totalExpectedRent = initialRent;
  } else if (isEarliestPast) {
    renewalRent = renewalPrice * validRecords.length;
    totalExpectedRent = renewalRent;
  } else {
    renewalRent = renewalPrice * (validRecords.length - 1);
    initialRent = newTenantPrice;
    totalExpectedRent = renewalRent + initialRent;
  }
  console.log("initialRent", initialRent);
  console.log("renewalRent", renewalRent);
  console.log("totalExpectedRent", totalExpectedRent);

  let totalDaysPaidFor = 0; // Total days in all periods
  let totalDaysSpent = 0; // Total days spent
  let remainingDays = 0; // Days from current date to latest due date
  let earliestStartDate: dayjs.Dayjs | null = null;
  let latestDueDate: dayjs.Dayjs | null = null;

  // Aggregate days for all periods
  validRecords.forEach((rec) => {
    const recStartDate = dayjs(rec.start_date);
    const recDueDate = dayjs(rec.due_date);

    // Calculate total days in the period
    const daysInPeriod = recDueDate.diff(recStartDate, "day");
    if (daysInPeriod <= 0) return; // Skip invalid date range

    totalDaysPaidFor += daysInPeriod;

    // Update earliest start and latest due dates
    if (!earliestStartDate || recStartDate.isBefore(earliestStartDate)) {
      earliestStartDate = recStartDate;
    }
    if (!latestDueDate || recDueDate.isAfter(latestDueDate)) {
      latestDueDate = recDueDate;
    }

    // Calculate days spent
    let periodDaysSpent = 0;
    if (currentDate.isBefore(recStartDate)) {
      // Future period
      periodDaysSpent = 0;
    } else if (currentDate.isAfter(recDueDate)) {
      // Past period
      periodDaysSpent = daysInPeriod;
    } else {
      // Ongoing period
      periodDaysSpent = currentDate.diff(recStartDate, "day");
    }

    totalDaysSpent += periodDaysSpent;

    // Calculate remaining days (ongoing and future periods only)
    if (!currentDate.isAfter(recDueDate)) {
      const periodRemainingDays = recDueDate.diff(
        currentDate.isBefore(recStartDate) ? recStartDate : currentDate,
        "day"
      );
      remainingDays += periodRemainingDays;
    }
  });

  let durationText: string;
  let costPerDay: number;
  let totalConsumedRent: number;
  let outstanding: number;
  let breakdown: { label: string; value: string }[];
  let prevUBreakdown: { label: string; value: string }[];
  let oustandingObj: { label: string; value: string }[];

  // Format occupancy and remaining periods
  const occupancyPeriodText =
    validRecords.length > 0
      ? `${earliestStartDate!.format("MMM D, YYYY")} - ${latestDueDate!.format(
          "MMM D, YYYY"
        )}`
      : "Not started";
  const remainingPeriodText =
    remainingDays > 0
      ? `${currentDate.format("MMM D, YYYY")} - ${latestDueDate!.format(
          "MMM D, YYYY"
        )}`
      : "No remaining period";
  const remainingDaysText = `${remainingDays} day${
    remainingDays !== 1 ? "s" : ""
  }`;
  durationText = `${totalDaysSpent} day${totalDaysSpent !== 1 ? "s" : ""}`;

  if (period) {
    // Case 1: Period is provided
    const periodDays = periodToDays(period);
    // Use average price per period for daily rate
    const averagePricePerPeriod = totalExpectedRent / validRecords.length;
    costPerDay = averagePricePerPeriod / periodDays;
    totalConsumedRent = costPerDay * totalDaysSpent;

    // Calculate outstanding balance
    outstanding = totalExpectedRent - totalConsumedRent;

    breakdown = [
      {
        label: "Initial Rent",
        value: `${currencySymbol}${formatNumber(initialRent.toFixed(2))}`,
      },
      {
        label: "Renewal Rent",
        value: `${currencySymbol}${formatNumber(renewalRent.toFixed(2))}`,
      },
      {
        label: "Occupancy Period",
        value: occupancyPeriodText,
      },
      {
        label: "Total Days Paid For",
        value: `${totalDaysPaidFor} day${totalDaysPaidFor !== 1 ? "s" : ""}`,
      },
      {
        label: "You spent",
        value: durationText,
      },
      {
        label: "Remaining Period",
        value: remainingPeriodText,
      },
      {
        label: "Remaining Days",
        value: remainingDaysText,
      },
      {
        label: `Cost per Day (${period})`,
        value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
      },
      {
        label: "We Deduct",
        value: `${currencySymbol}${formatNumber(totalConsumedRent.toFixed(2))}`,
      },
      {
        label: "You paid",
        value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
      },
      {
        label: outstanding < 0 ? "Your refund" : "Your balance",
        value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
      },
    ];

    prevUBreakdown = [
      {
        label: "Occupancy Period",
        value: durationText,
      },
      {
        label: "Rent Consumed",
        value: `${currencySymbol}${formatNumber(totalConsumedRent.toFixed(2))}`,
      },
      {
        label: "Outstanding Rent",
        value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
      },
      {
        label: "You spent",
        value: durationText,
      },
      {
        label: "Initial Rent",
        value: `${currencySymbol}${formatNumber(initialRent.toFixed(2))}`,
      },
      {
        label: "Renewal Rent",
        value: `${currencySymbol}${formatNumber(renewalRent.toFixed(2))}`,
      },
      {
        label: `Cost per Day (${period})`,
        value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
      },
      {
        label: "We Deduct",
        value: `${currencySymbol}${formatNumber(totalConsumedRent.toFixed(2))}`,
      },
    ];

    outstanding = outstanding;
    oustandingObj = [
      {
        label: "Outstanding Rent",
        value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
      },
    ];
  } else {
    // Case 2: Period is not provided
    if (totalDaysPaidFor <= 0) {
      return {
        duration: "-",
        breakdown: [{ label: "Error", value: "Invalid date range" }],
        prevUBreakdown: [{ label: "Error", value: "Invalid date range" }],
        oustandingObj: [],
      };
    }

    costPerDay = totalExpectedRent / totalDaysPaidFor;
    totalConsumedRent = costPerDay * totalDaysSpent;
    outstanding = totalExpectedRent - totalConsumedRent;

    breakdown = [
      {
        label: "Initial Rent",
        value: `${currencySymbol}${formatNumber(initialRent.toFixed(2))}`,
      },
      {
        label: "Renewal Rent",
        value: `${currencySymbol}${formatNumber(renewalRent.toFixed(2))}`,
      },
      {
        label: "Occupancy Period",
        value: occupancyPeriodText,
      },
      {
        label: "Total Days Paid For",
        value: `${totalDaysPaidFor} day${totalDaysPaidFor !== 1 ? "s" : ""}`,
      },
      {
        label: "You spent",
        value: durationText,
      },
      {
        label: "Remaining Period",
        value: remainingPeriodText,
      },
      {
        label: "Remaining Days",
        value: remainingDaysText,
      },
      {
        label: "Cost per Day",
        value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
      },
      {
        label: "We Deduct",
        value: `${currencySymbol}${formatNumber(totalConsumedRent.toFixed(2))}`,
      },
      {
        label: "You paid",
        value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
      },
      {
        label: outstanding < 0 ? "Your refund" : "Your balance",
        value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
      },
    ];

    prevUBreakdown = [
      {
        label: "Occupancy Period",
        value: durationText,
      },
      {
        label: "Rent Consumed",
        value: `${currencySymbol}${formatNumber(totalConsumedRent.toFixed(2))}`,
      },
      {
        label: "Outstanding Rent",
        value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
      },
      {
        label: "You spent",
        value: durationText,
      },
      {
        label: "Initial Rent",
        value: `${currencySymbol}${formatNumber(initialRent.toFixed(2))}`,
      },
      {
        label: "Renewal Rent",
        value: `${currencySymbol}${formatNumber(renewalRent.toFixed(2))}`,
      },
      {
        label: "Cost per Day",
        value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
      },
      {
        label: "We Deduct",
        value: `${currencySymbol}${formatNumber(totalConsumedRent.toFixed(2))}`,
      },
    ];

    outstanding = outstanding;
    oustandingObj = [
      {
        label: "Outstanding Rent",
        value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
      },
    ];
  }

  return {
    duration: durationText,
    breakdown,
    prevUBreakdown,
    oustandingObj,
    outstanding,
  };
};

// export const getBalanceBreakdown = (
//   rent: any,
//   record: any,
//   records:any,
//   period: RentPeriod | undefined,
//   currencySymbol: string
// ) => {
//   // Validate required fields
//   if (!record.start_date || !record.due_date) {
//     return {
//       duration: "-",
//       breakdown: [{ label: "Error", value: "Missing start date or due date" }],
//     };
//   }

//   const startDate = dayjs(record.start_date);
//   const dueDate = dayjs(record.due_date);
//   const currentDate = dayjs();

//   // Parse amount_paid (remove currency symbol if present)
//   const amountPaid = parseCurrency(rent)
//   // const amountPaid = parseFloat(
//   //   record.amount_paid?.replace(currencySymbol, "") || "0"
//   // );

//   let daysSpent: number;
//   let durationText: string;
//   let costPerDay: number;
//   let totalExpectedRent: number; // Amount spent
//   let outstanding: number;
//   let oustandingObj: { label: string; value: string }[];
//   let breakdown: { label: string; value: string }[];
//   let prevUBreakdown: { label: string; value: string }[];

//   if (period) {
//     // Case 1: Period is provided
//     const endDate = dueDate.isAfter(currentDate) ? currentDate : dueDate;
//     daysSpent = Math.max(0, endDate.diff(startDate, "day")); // Prevent negative days
//     durationText = `${daysSpent} day${daysSpent !== 1 ? "s" : ""}`;
//     const periodDays = periodToDays(period);
//     costPerDay = amountPaid / periodDays;
//     totalExpectedRent = costPerDay * daysSpent;

//     // Calculate overdue periods
//     const overduePeriods = calculateOverduePeriods(
//       dueDate.format("DD/MM/YYYY"),
//       period
//     );

//     // Calculate outstanding balance
//     outstanding = calculateOutstandingBalance(
//       // record.amount_paid,
//       rent,
//       records
//       // record.due_date
//     );

//     // outstanding = calculateBalance(
//     //   // record.amount_paid,
//     //   rent,
//     //   record.start_date,
//     //   record.due_date
//     // );

//     prevUBreakdown = [
//       {
//         label: "Occupancy Period",
//         value: currentDate.isBefore(startDate)
//           ? "Not started"
//           : // : `${startDate.format("MMM D, YYYY")} - ${endDate.format(
//             //     "MMM D, YYYY"
//             //   )}`,
//             durationText,
//       },
//       {
//         label: "Rent Consumed",
//         value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
//       },
//       {
//         label: "Outstanding Rent",
//         value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//       },
//       // DELETE LATER
//       {
//         label: "You spent",
//         value: durationText,
//       },
//       {
//         label: `Cost per Day (${period})`,
//         value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
//       },
//       {
//         label: "We Deduct",
//         value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
//       },
//     ];

//     breakdown = [
//       {
//         label: "Occupancy Period",
//         value: currentDate.isBefore(startDate)
//           ? "Not started"
//           : `${startDate.format("MMM D, YYYY")} - ${endDate.format(
//               "MMM D, YYYY"
//             )}`,
//       },
//       {
//         label: "You spent",
//         value: durationText,
//       },
//       {
//         label: `Cost per Day (${period})`,
//         value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
//       },
//       {
//         label: "We Deduct",
//         value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
//       },
//       {
//         label: "You paid",
//         value: record.amount_paid || `${currencySymbol}0`,
//       },
//       ...(overduePeriods > 0
//         ? [
//             {
//               label: "Overdue Periods",
//               value: `${overduePeriods} ${period}`,
//             },
//           ]
//         : []),
//       {
//         label: outstanding < 0 ? "Your refund" : "Your balance",
//         value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//       },
//     ];

//     oustandingObj = [
//       {
//         label: "Outstanding Rent",
//         value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//       },
//     ];
//   } else {
//     // Case 2: Period is not provided
//     const totalDays = dueDate.diff(startDate, "day");
//     if (totalDays <= 0) {
//       return {
//         duration: "-",
//         prevUBreakdown: [{ label: "Error", value: "Invalid date range" }],
//         breakdown: [{ label: "Error", value: "Invalid date range" }],
//       };
//     }

//     daysSpent = currentDate.isBefore(startDate)
//       ? 0
//       : Math.max(
//           0,
//           dueDate.isAfter(currentDate)
//             ? currentDate.diff(startDate, "day")
//             : dueDate.diff(startDate, "day")
//         );
//     const daysLeft = totalDays - daysSpent;
//     durationText = `${daysSpent} day${daysSpent !== 1 ? "s" : ""}`;
//     costPerDay = amountPaid / totalDays;
//     totalExpectedRent = costPerDay * daysSpent; // Amount spent
//     const amountLeft = amountPaid - totalExpectedRent; // Amount remaining

//     // Calculate outstanding balance (use calculateBalance or amountLeft)
//     outstanding =
//       calculateBalance(
//         // record.amount_paid,
//         rent,
//         record.start_date,
//         record.due_date
//       ) || amountLeft; // Fallback to amountLeft

//     breakdown = [
//       {
//         label: "Occupancy Period",
//         value: currentDate.isBefore(startDate)
//           ? "Not started"
//           : `${startDate.format("MMM D, YYYY")} - ${dueDate.format(
//               "MMM D, YYYY"
//             )}`,
//       },
//       {
//         label: "Total Days",
//         value: `${totalDays} day${totalDays !== 1 ? "s" : ""}`,
//       },
//       {
//         label: "You spent",
//         value: durationText,
//       },
//       {
//         label: "Days Left",
//         value: `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`,
//       },
//       {
//         label: "Cost per Day",
//         value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
//       },
//       {
//         label: "We Deduct",
//         value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
//       },
//       {
//         label: "You paid",
//         value: record.amount_paid || `${currencySymbol}0`,
//       },
//       {
//         label: outstanding < 0 ? "Your refund" : "Your balance",
//         value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//       },
//     ];

//     prevUBreakdown = [
//       {
//         label: "Occupancy Period",
//         value: currentDate.isBefore(startDate)
//           ? "Not started"
//           : // : `${startDate.format("MMM D, YYYY")} - ${dueDate.format(
//             //     "MMM D, YYYY"
//             //   )}`,
//             durationText,
//       },
//       {
//         label: "Rent Consumed",
//         value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
//       },
//       {
//         label: "Outstanding Rent",
//         value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//       },
//       // DELETE
//       {
//         label: "You spent",
//         value: durationText,
//       },
//       {
//         label: `Cost per Day (${period})`,
//         value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
//       },
//       {
//         label: "We Deduct",
//         value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
//       },
//     ];

//     oustandingObj = [
//       {
//         label: "Outstanding Rent",
//         value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//       },
//     ];
//   }

//   return { duration: durationText, breakdown, prevUBreakdown, oustandingObj };
// };

// Helper function to calculate duration and breakdown
// export const getBalanceBreakdown = (
//   record: any,
//   period: RentPeriod,
//   currencySymbol: string
// ) => {
//   if (!record.start_date || !record.due_date || !period) {
//     return {
//       duration: "-",
//       breakdown: [
//         { label: "Error", value: "Missing start date, due date, or period" },
//       ],
//     };
//   }

//   const startDate = dayjs(record.start_date);
//   const dueDate = dayjs(record.due_date);
//   const currentDate = dayjs();
//   const endDate = dueDate.isAfter(currentDate) ? currentDate : dueDate;

//   // Calculate duration in days
//   const daysSpent = endDate.diff(startDate, "day");
//   const durationText = `${daysSpent} day${daysSpent !== 1 ? "s" : ""}`;

//   // Calculate overdue periods
//   const overduePeriods = calculateOverduePeriods(
//     dueDate.format("DD/MM/YYYY"),
//     period
//   );

//   // Parse amount_paid (remove currency symbol if present)
//   const amountPaid = parseFloat(
//     record.amount_paid?.replace(currencySymbol, "") || "0"
//   );

//   // Calculate cost per period (assume amount_paid is the rent for the full period)
//   const periodDays = periodToDays(period);
//   const costPerDay = amountPaid / periodDays;

//   // Calculate expected rent for days spent
//   const totalExpectedRent = costPerDay * daysSpent;

//   // Calculate outstanding balance
//   const outstanding = calculateBalance(
//     record.amount_paid,
//     record.start_date,
//     record.due_date
//   );

//   const breakdown = [
//     {
//       label: "Occupancy Period",
//       value: `${startDate.format("MMM D, YYYY")} - ${endDate.format(
//         "MMM D, YYYY"
//       )}`,
//     },
//     {
//       label: "You spent",
//       value: durationText,
//     },
//     {
//       label: `Cost per Day (${period})`,
//       value: `${currencySymbol}${formatNumber(costPerDay.toFixed(2))}`,
//     },
//     {
//       label: "We Deduct",
//       value: `${currencySymbol}${formatNumber(totalExpectedRent.toFixed(2))}`,
//     },
//     {
//       label: "You paid",
//       value: record.amount_paid || `${currencySymbol}0`,
//     },
//     ...(overduePeriods > 0
//       ? [
//           {
//             label: "Overdue Periods",
//             value: `${overduePeriods} ${period}`,
//           },
//         ]
//       : []),
//     {
//       label: "Your balance",
//       value: `${currencySymbol}${formatNumber(Math.abs(outstanding))}`,
//     },
//   ];

//   return { duration: durationText, breakdown };
// };

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
