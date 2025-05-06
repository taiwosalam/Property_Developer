import { Currency } from "@/utils/number-formatter";
import { FeeDetail } from "../types";
import { formatFee } from "@/app/(nav)/management/rent-unit/data";
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
    newUnitTotalFormatted: newUnitTotalFormatted || '',
    totalPayable
  };
};

// Helper function to get unit details
export const getUnitDetails = (
  unitData: any,
  currency: Currency = "naira"
): DeductionItem[] => {
  if (!unitData) return [];
  return [
    { label: "Start Date", value: unitData?.start_date || "" },
    { label: "Due Date", value: unitData?.due_date || "" },
    {
      label: `${unitData?.fee_period || "Yearly"} Rent`,
      value: formatFee(
        unitData?.newTenantPrice || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "Inspection Fee",
      value: formatFee(
        unitData?.inspection_fee || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "Legal Fee",
      value: formatFee(
        unitData?.legal_fee || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "Caution Fee",
      value: formatFee(
        unitData?.caution_fee || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "VAT Amount",
      value: formatFee(
        unitData?.vat_amount || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "Service Charge",
      value: formatFee(
        unitData?.service_charge || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "Agency Fee",
      value: formatFee(
        unitData?.unitAgentFee || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "Other Fee",
      value: formatFee(
        unitData?.other_charge || 0,
        unitData?.currency || currency
      ),
    },
    {
      label: "Total Package",
      value: formatFee(
        unitData?.newTenantPrice || 0,
        unitData?.currency || currency
      ),
    },
  ].filter((item) => {
    if (item.value === undefined || item.value === "") return false;
    if (typeof item.value === "string" && /^_.*,.*,_*$/.test(item.value))
      return false;
    return true;
  });
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
