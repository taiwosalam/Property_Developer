import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { FeeDetail } from "../types";
import {
  // calculateOverduePeriods,
  formatOwingPeriod,
} from "@/app/(nav)/management/rent-unit/[id]/renew-rent/data";
import { RentPeriod } from "../data";
import dayjs from "dayjs";
import { calculateRentPenalty } from "@/app/(nav)/management/rent-unit/data";

interface UnitData {
  fee_period?: string;
  renew_fee_amount?: number | string;
  propertyId?: string;
}

interface FeeDetailsParams {
  isRental: boolean;
  currency: keyof typeof currencySymbols;
  owingAmount: number;
  overduePeriods: number;
  unitData: UnitData;
  penaltyAmount: number;
}

interface FeeDetailsParams {
  isRental: boolean;
  currency: keyof typeof currencySymbols;
  owingAmount: number;
  overduePeriods: number;
  unitData: {
    renew_fee_amount?: number | string;
    fee_period?: string;
    propertyId?: string;
  };
  penaltyAmount: number;
}


interface FeeDetailsParams {
  isRental: boolean;
  currency: keyof typeof currencySymbols;
  owingAmount: number;
  overduePeriods: number;
  unitData: {
    renew_fee_amount?: number | string;
    fee_period?: string;
    propertyId?: string;
  };
  penaltyAmount: number;
}

export const getDueFeeDetails = ({
  isRental,
  currency,
  owingAmount,
  overduePeriods,
  unitData,
  penaltyAmount,
}: FeeDetailsParams): FeeDetail[] => {
  const formatCurrency = (amount: number): string =>
    `${currencySymbols[currency] || "₦"}${formatNumber(amount)}`;

  const details: FeeDetail[] = [
    {
      name: isRental ? "Renewal Total Package" : "Renewal Total Fee",
      amount: unitData.renew_fee_amount
        ? formatCurrency(parseFloat(unitData.renew_fee_amount.toString()))
        : "",
    },
  ];

  if (overduePeriods > 0) {
    details.push({
      name: "Owing Period",
      amount: formatOwingPeriod(overduePeriods, (unitData.fee_period as RentPeriod) || ""),
    });
    details.push({
      name: "Owing Amount",
      amount: owingAmount ? formatCurrency(owingAmount) : "",
    });
  }

  if (penaltyAmount > 0) {
    details.push({
      name: "Rent Penalty",
      amount: formatCurrency(penaltyAmount),
    });
  }

  console.log("getDueFeeDetails output:", details);
  return details;
};

// Renamed calculateRentFeeAmountAndPeriods
export const calculateRentFeeAmountAndPeriods = ({
  start_date,
  due_date,
  feePeriod,
  renew_fee_amount,
}: {
  start_date: string;
  due_date: string;
  feePeriod: RentPeriod;
  renew_fee_amount: number;
}): { overduePeriods: number; owingAmount: number } => {
  const parsedStartDate = dayjs(start_date, "DD/MM/YYYY");
  const parsedDueDate = dayjs(due_date, "DD/MM/YYYY");
  const now = dayjs();

  if (
    !parsedStartDate.isValid() ||
    !parsedDueDate.isValid() ||
    !feePeriod ||
    !renew_fee_amount
  ) {
    console.error("Invalid or missing inputs:", {
      start_date,
      due_date,
      feePeriod,
      renew_fee_amount,
    });
    return { overduePeriods: 0, owingAmount: 0 };
  }

  let expectedPeriodDuration: number;
  switch (feePeriod) {
    case "daily":
      expectedPeriodDuration = 1;
      break;
    case "weekly":
      expectedPeriodDuration = parsedDueDate.diff(parsedStartDate, "week") || 1;
      break;
    case "monthly":
      expectedPeriodDuration = parsedDueDate.diff(parsedStartDate, "month") || 1;
      break;
    case "quarterly":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "month") / 3) || 1;
      break;
    case "yearly":
      expectedPeriodDuration = parsedDueDate.diff(parsedStartDate, "year") || 1;
      break;
    case "biennially":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 2) || 1;
      break;
    case "triennially":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 3) || 1;
      break;
    case "quadrennial":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 4) || 1;
      break;
    case "quinquennial":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 5) || 1;
      break;
    case "sexennial":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 6) || 1;
      break;
    case "septennial":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 7) || 1;
      break;
    case "octennial":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 8) || 1;
      break;
    case "nonennial":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 9) || 1;
      break;
    case "decennial":
      expectedPeriodDuration = (parsedDueDate.diff(parsedStartDate, "year") / 10) || 1;
      break;
    default:
      expectedPeriodDuration = 1;
  }

  console.log("expectedPeriodDuration", expectedPeriodDuration);

  let overdueDuration: number;
  switch (feePeriod) {
    case "daily":
      overdueDuration = now.diff(parsedDueDate, "day");
      break;
    case "weekly":
      overdueDuration = now.diff(parsedDueDate, "week");
      break;
    case "monthly":
      overdueDuration = now.diff(parsedDueDate, "month");
      break;
    case "quarterly":
      overdueDuration = now.diff(parsedDueDate, "month") / 3;
      break;
    case "yearly":
      overdueDuration = now.diff(parsedDueDate, "year");
      break;
    case "biennially":
      overdueDuration = now.diff(parsedDueDate, "year") / 2;
      break;
    case "triennially":
      overdueDuration = now.diff(parsedDueDate, "year") / 3;
      break;
    case "quadrennial":
      overdueDuration = now.diff(parsedDueDate, "year") / 4;
      break;
    case "quinquennial":
      overdueDuration = now.diff(parsedDueDate, "year") / 5;
      break;
    case "sexennial":
      overdueDuration = now.diff(parsedDueDate, "year") / 6;
      break;
    case "septennial":
      overdueDuration = now.diff(parsedDueDate, "year") / 7;
      break;
    case "octennial":
      overdueDuration = now.diff(parsedDueDate, "year") / 8;
      break;
    case "nonennial":
      overdueDuration = now.diff(parsedDueDate, "year") / 9;
      break;
    case "decennial":
      overdueDuration = now.diff(parsedDueDate, "year") / 10;
      break;
    default:
      overdueDuration = 0;
  }

  console.log("overdueDuration", overdueDuration);

  let periods = 0;
  let owingAmount = 0;
  if (overdueDuration >= expectedPeriodDuration && expectedPeriodDuration > 0) {
    if (feePeriod === "daily") {
      periods = Math.floor(overdueDuration);
    } else {
      periods = calculateOverduePeriods(due_date, feePeriod);
    }
    owingAmount = periods * renew_fee_amount;
  }

  console.log("calculateRentFeeAmountAndPeriods result:", {
    overduePeriods: periods,
    owingAmount,
  });

  return { overduePeriods: periods, owingAmount };
};


export const calculateOverduePeriods = (
  dueDate: string,
  period: RentPeriod
): number => {
  const now = dayjs();
  const due = dayjs(dueDate, "DD/MM/YYYY");

  console.log("calculateOverduePeriods inputs:", {
    dueDate,
    parsedDue: due.format("DD/MM/YYYY"),
    now: now.format("DD/MM/YYYY"),
    period,
    isOverdue: now.isAfter(due),
  });

  if (!due.isValid() || now.isBefore(due) || now.isSame(due, "day")) {
    console.log("Not overdue or invalid date:", {
      dueDate,
      isValid: due.isValid(),
    });
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
      return Math.floor(now.diff(due, "month") / 3);
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
      console.log("Unknown period:", period);
      return 0;
  }
};

interface OwingCalculationInputs {
  start_date: string;
  due_date: string;
  feePeriod: RentPeriod;
  renewalTenantTotalPrice: number;
}

// Interface for calculation outputs
interface OwingCalculationResult {
  overduePeriods: number;
  owingAmount: number;
}
