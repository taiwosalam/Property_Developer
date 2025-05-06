import { Currency } from "@/utils/number-formatter";
import { FeeDetail } from "../types";
import { formatFee } from "@/app/(nav)/management/rent-unit/data";
import dayjs from "dayjs";
export interface DeductionItem {
  label: string;
  value: string;
}

export interface TotalPayableResult {
  newUnitTotal: number;
  newUnitTotalFormatted: string;
  totalPayable: number;
}

export const getNewUnitFeeDetails = (
  unitData: any,
  calculation: boolean,
  isRental: boolean
): FeeDetail[] => {
  return [
    {
      name: isRental ? `${unitData.fee_period} Rent` : "Fee",
      amount: calculation
        ? unitData.newTenantPrice
        : unitData.renewalTenantPrice,
    },
    {
      name: "Service Charge",
      amount: calculation
        ? unitData.service_charge
        : unitData.renew_service_charge,
    },
    {
      name: "Security Fee",
      amount: calculation ? unitData.security_fee : "",
    },
    {
      name: "Agency Fee",
      amount: calculation ? unitData.unitAgentFee : "",
    },
    {
      name: "Caution Fee",
      amount: calculation ? unitData.caution_fee : "",
    },
    {
      name: "VAT Amount",
      amount: calculation ? unitData.vat_amount : unitData.renew_vat_amount,
    },
    {
      name: "Other Charges",
      amount: calculation ? unitData.other_charge : unitData.renew_other_charge,
    },
  ];
};

// Helper function to get deductions arrays
export const getDeductionsArrays = (
  calculation: boolean,
  newUnitTotalFormatted: string,
  totalPayable: number,
  oustandingObj: any[] = [],
  unitData: any | null,
  currency: Currency = "naira"
): { deductionsCal: DeductionItem[]; deductionsRes: DeductionItem[] } => {
  const deductionsCal = [
    {
      label: calculation ? "New Tenant Package" : "Renewal Total Package",
      value:
        newUnitTotalFormatted || formatFee(0, unitData?.currency || currency),
    },
    {
      label: calculation ? "Do Deduction" : "No Deduction",
      value: formatFee(totalPayable, unitData?.currency || currency),
    },
  ];

  const deductionsRes = [
    {
      label: calculation ? "New Tenant Package" : "Renewal Total Package",
      value:
        newUnitTotalFormatted || formatFee(0, unitData?.currency || currency),
    },
    ...(Array.isArray(oustandingObj) ? oustandingObj : []),
    {
      label: calculation ? "Do Deduction" : "No Deduction",
      value: formatFee(totalPayable, unitData?.currency || currency),
    },
  ];

  return {
    deductionsCal: deductionsCal.filter(
      (item) => item.value !== undefined
    ) as DeductionItem[],
    deductionsRes: deductionsRes.filter(
      (item) => item.value !== undefined
    ) as DeductionItem[],
  };
};

// Helper function to compute total payable and related values
export const getTotalPayable = (
  calculation: boolean,
  deduction: boolean,
  unitData: any | null,
  outstanding: number,
  currency: Currency = "naira"
): TotalPayableResult => {
  const newUnitTotal = calculation
    ? Number(unitData?.newTenantTotalPrice || 0)
    : Number(unitData?.renewalTenantTotalPrice || 0);
  const newUnitTotalFormatted = calculation
    ? formatFee(
        unitData?.newTenantTotalPrice || 0,
        unitData?.currency || currency
      )
    : formatFee(
        unitData?.renewalTenantTotalPrice || 0,
        unitData?.currency || currency
      );
  const totalPayable = deduction ? outstanding - newUnitTotal : newUnitTotal;

  return {
    newUnitTotal,
    newUnitTotalFormatted: newUnitTotalFormatted || "",
    totalPayable,
  };
};

// Helper function to get unit details
export const getUnitDetails = (
  unitData: any,
  currency: Currency = "naira",
  startDate?: string | null,
  dueDate?: string | null
): DeductionItem[] => {
  if (!unitData) return [];

  const items: DeductionItem[] = [
    { label: "Start Date", value: startDate || "--- ---" },
    { label: "Due Date", value: dueDate || "--- ---" },
    {
      label: `${unitData?.fee_period || "Yearly"} Rent`,
      value: formatFee(
        unitData?.newTenantPrice || 0,
        unitData?.currency || currency
      ) || "",
    },
    {
      label: "Inspection Fee",
      value: formatFee(
        unitData?.inspection_fee,
        unitData?.currency || currency
      ) || "",
    },
    {
      label: "Legal Fee",
      value: formatFee(unitData?.legal_fee, unitData?.currency || currency) || "",
    },
    {
      label: "Caution Fee",
      value: formatFee(unitData?.caution_fee, unitData?.currency || currency) || "",
    },
    {
      label: "VAT Amount",
      value: formatFee(unitData?.vat_amount, unitData?.currency || currency) || "",
    },
    {
      label: "Service Charge",
      value: formatFee(
        unitData?.service_charge,
        unitData?.currency || currency
      ) || "",
    },
    {
      label: "Agency Fee",
      value: formatFee(unitData?.unitAgentFee, unitData?.currency || currency) || "",
    },
    {
      label: "Other Fee",
      value: formatFee(unitData?.other_charge, unitData?.currency || currency) || "",
    },
    {
      label: "Total Package",
      value: formatFee(
        unitData?.newTenantTotalPrice,
        unitData?.currency || currency
      ) || "",
    },
  ];

  const filteredItems = items.filter((item) => {
    // Allow "N/A" and non-empty formatted values
    if (item.value === "N/A") return true;
    if (item.value === undefined || item.value === "") return false;
    if (typeof item.value === "string" && /^_.*,.*,_*$/.test(item.value))
      return false;
    // Allow zero values (e.g., "₦0.00")
    return true;
  });
  return filteredItems;
};

// Helper function to get current rent detail items

export const getCurrentRentDetailItems = (
  unitData: any,
  startDate: string | null,
  breakdown: any[],
  currency: Currency = "naira"
): DeductionItem[] => {
  if (!unitData) return [];
  return [
    {
      label: `${unitData?.fee_period || "Yearly"} Rent`,
      value: formatFee(
        unitData?.newTenantTotalPrice || 0,
        unitData?.currency || currency
      ),
    },
    { label: "Start Date", value: startDate || "" },
    { label: "Due Date", value: unitData?.due_date || "" },
    ...breakdown,
  ].filter((item) => {
    if (item.value === undefined || item.value === "") return false;
    if (typeof item.value === "string" && /^_.*,.*,_*$/.test(item.value))
      return false;
    return true;
  });
};

// Interface for balance record
interface BalanceRecord {
  start_date?: string;
  due_date?: string;
  [key: string]: any;
}

// Helper function to extract start_date and due_date from balance records
export function extractBalanceDates(
  records: BalanceRecord[],
  fee_period: string = "yearly",
  fallbackStartDate?: string | null
): { start_date: string | null; due_date: string | null } {
  const today = dayjs().startOf("day");
  let start_date: string | null = null;
  let due_date: string | null = null;

  // Filter valid records with both start_date and due_date
  const validRecords = records.filter(
    (record) => record.start_date && record.due_date
  );

  if (validRecords.length > 0) {
    // Find earliest start_date that is today or future
    const futureStartDates = validRecords
      .map((record) => ({
        date: dayjs(record.start_date),
        formatted: dayjs(record.start_date).format("MMM D, YYYY").toLowerCase(),
      }))
      .filter(({ date }) => date.isSame(today, "day") || date.isAfter(today))
      .sort((a, b) => a.date.diff(b.date));

    start_date = futureStartDates[0]?.formatted || null;

    // Find latest due_date that is in the future
    const futureDueDates = validRecords
      .map((record) => ({
        date: dayjs(record.due_date),
        formatted: dayjs(record.due_date).format("MMM D, YYYY").toLowerCase(),
      }))
      .filter(({ date }) => date.isAfter(today))
      .sort((a, b) => b.date.diff(a.date)); // Sort descending

    due_date = futureDueDates[0]?.formatted || null;
  }

  // Fallback: Use fallbackStartDate and calculate due_date
  if (!start_date && fallbackStartDate) {
    start_date = fallbackStartDate;
  }

  if (!due_date && start_date) {
    const start = dayjs(start_date);
    due_date = start
      .add(
        fee_period === "daily" ? 1 : 365,
        fee_period === "daily" ? "day" : "day"
      )
      .format("MMM D, YYYY")
      .toLowerCase();
  }

  return { start_date, due_date };
}
