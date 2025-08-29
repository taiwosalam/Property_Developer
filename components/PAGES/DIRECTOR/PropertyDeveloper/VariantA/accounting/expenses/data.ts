import api, { handleAxiosError } from "@/services/api";
import { formatHtmlDescription } from "../disbursement/data";
import { formatNumber } from "@/utils/number-formatter";
import dayjs from "dayjs";
import {
  Expense,
  ExpensesApiResponse,
  ExpenseStats,
  StaffListResponse,
  TransformedExpensesData,
} from "./types.";
import { parseCurrency } from "./[expenseId]/manage-expenses/data";

export interface ExpensesRequestParams {
  // page?: number;
  search?: string;
  // sort_order?: "asc" | "desc";
  states?: string;
  date_filter?: any;
  from_date?: string;
  to_date?: string;
  property_ids?: string[];
  created_by?: string[];
}

export const accountingExpensesOptionsWithDropdown = [
  {
    label: "account officer",
    value: [
      { label: "account officer 1", value: "account officer1" },
      { label: "account officer 2", value: "account officer2" },
      { label: "account officer 3", value: "account officer3" },
    ],
  },
];

export const expenseTableFields = [
  // { id: "1", accessor: "picture", isImage: true, picSize: 40 },
  { id: "1", label: "S/N", accessor: "S/N" },
  { id: "2", label: "Date", accessor: "date" },
  { id: "3", label: "Client Name", accessor: "name" },
  {
    id: "4",
    label: "Description",
    accessor: "description",
  },
  { id: "5", label: "Amount", accessor: "amount" },
  { id: "6", label: "Payment", accessor: "payment" },
  { id: "7", label: "Balance", accessor: "balance" },
  { id: "8", accessor: "action" },
];

export const expenseTableData = () => {
  const names = [
    "Samuel Fiyinfoluwa",
    "Dada Teniola Emmanuel",
    "Abdulrafiu Mubi",
  ];
  const descriptions = [
    "Water Plumbing",
    "Electricity",
    "Roof leakage",
    "Maintenance",
  ];
 const getRandomValue = () => {
    return `₦${(Math.floor(Math.random() * 20000) + 102000).toLocaleString()}`;
  };
  return Array.from({ length: 15 }, (_, index) => ({
    id: index + 1,
    picture: "/empty/SampleLandlord.jpeg",
    date: "02/03/2024",
    name: names[index % names.length],
    description: descriptions[index % descriptions.length],
    amount: getRandomValue(),
    payment: getRandomValue(),
    balance: index % 2 === 0 ? getRandomValue() : null,
  }));
};

export const transformExpensesData = (
  apiResponse: ExpensesApiResponse
): TransformedExpensesData => {
  const expenses: Expense[] = apiResponse.data.expenses.map((item) => ({
    id: item.id,
    picture: "",
    date: dayjs(item.created_at).format("MMM DD YYYY"),
    name: item.property,
    description: formatHtmlDescription(item.description),
    amount: item.amount
      ? `₦${formatNumber(parseFloat(item.amount.replace(/,/g, "")))}`
      : undefined,
    payment: item.payment
      ? `₦${formatNumber(parseFloat(item.payment.replace(/,/g, "")))}`
      : undefined,
    balance: item.balance
      ? `₦${formatNumber(parseFloat(item.balance.replace(/,/g, "")))}`
      : undefined,
  }));

  const stats: ExpenseStats = {
    total_amount: Number(apiResponse.data.statistic.total_amount),
    total_deduct: Number(apiResponse.data.statistic.total_deduct),
    total_balance: Number(apiResponse.data.statistic.total_balance),
    percentage_change_amount:
      apiResponse.data.statistic.percentage_change_amount,
    percentage_change_deduct:
      apiResponse.data.statistic.percentage_change_deduct,
    percentage_change_balance:
      apiResponse.data.statistic.percentage_change_balance,
  };

  return { expenses, stats };
};

export const transformStaffs = (
  response: StaffListResponse
): { value: string; label: string }[] => {
  return response.data
    .filter((staff) => staff.staff_role.toLowerCase().includes("officer"))
    .map((staff) => ({
      value: `${staff.id}`,
      label: staff.user.name,
    }));
};

export const createExpense = async (data: any) => {
  try {
    const res = await api.post(`/expenses`, data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// Helper function to count digits in the balance
export const getDigitCount = (balance: number | string): number => {
  // Convert balance to string and remove non-digit characters (e.g., commas, decimals)
  const balanceStr = typeof balance === "number" ? balance.toString() : balance;
  // Remove any non-digit characters (e.g., commas from formatted numbers)
  // const digitsOnly = balanceStr.replace(/[^0-9]/g, "");
  const digitsOnly = parseCurrency(balanceStr).toString();
  return digitsOnly.length;
};
