import api, { handleAxiosError } from "@/services/api";
import dayjs, { Dayjs } from "dayjs";


// Raw API response interfaces
export interface ManageExpenseApiResponse {
  status: string;
  data: ManageExpenseData;
  message: string;
}

export interface ManageExpenseData {
  id: string;
  property_id: string;
  unit: string[];
  property: string;
  description: string;
  account_officer: string | null;
  account_officer_updated: string | null;
  total_amount: string;
  total_deducted: string;
  total_balance: number | string;
  added_expenses: AddedExpense[];
  deducted_payments: DeductedPayment[];
  created_at: string;
  updated_at: string;
}

export interface AddedExpense {
  amount: string;
  payment_title: string;
}

export interface Payment {
  title: string;
  amount: number;
}

export interface DeductedPayment {
  date: Dayjs;
  amount: number;
}

export interface ManageExpensePageData {
  expenseDetails: {
    paymentId: string;
    customerName: string;
    propertyName: string;
    date: string;
    accountOfficer: string;
    unitId: string;
  };
  description: string;
  payments: Payment[];
  stats: {
    totalAmount: number;
    totalDeducted: number;
    totalBalance: number;
  };
  deductions: DeductedPayment[];
}


// Remove HTML tags from a string
export const formatHtmlDescription = (html: string): string =>
  html.replace(/<\/?[^>]+(>|$)/g, "").trim();

// Parse a currency string (removing commas) to a number
export function parseCurrency(value: any): number {
  if (!value) return 0;
  const cleanValue = String(value).replace(/[₦$€£, ]/g, "");
  const parsed = parseFloat(cleanValue);
  return isNaN(parsed) ? 0 : parsed;
}



export const transformManageExpenseData = (
  apiResponse: ManageExpenseApiResponse
): ManageExpensePageData => {
  const data = apiResponse.data;
  return {
    expenseDetails: {
      paymentId: data.id,
      customerName: data.account_officer || "--- ---",
      propertyName: data.property,
      date: dayjs(data.created_at).format("MMM DD YYYY"),
      accountOfficer: data.account_officer || "--- ---",
      unitId: data.unit && data.unit.length > 0 ? data.unit.join(", ") : "",
    },
    description: formatHtmlDescription(data.description),
    payments: data.added_expenses.map((exp) => ({
      title: exp.payment_title,
      amount: parseFloat(exp.amount),
    })),
    stats: {
      totalAmount: parseCurrency(data.total_amount),
      totalDeducted: parseCurrency(data.total_deducted),
      totalBalance:
        typeof data.total_balance === "number"
          ? data.total_balance
          : parseCurrency(data.total_balance as string),
    },
    deductions: data.deducted_payments
      ? data.deducted_payments.map((ded) => ({
        date: dayjs(ded.date) as Dayjs,
        amount: ded.amount,
        // date: dayjs(ded.date).format("MMM DD YYYY"),
        // amount: parseFloat(ded.amount.replace(/,/g, "")),
      }))
      : [],
  };
};


// /expenses/1/deduct
export const deductPayment = async (data: any, id: number) => {
  try {
    const res = await api.post(`/expenses/${id}/deduct`, data);
    if (res.status === 200) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error)
    return false;
  }
}

// /expenses/1/payments
export const addPayment = async (data: any, id: number) => {
  try {
    const res = await api.post(`/expenses/${id}/payments`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error)
    return false;
  }
}