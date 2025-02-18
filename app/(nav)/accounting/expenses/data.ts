import api, { handleAxiosError } from "@/services/api";
import { formatHtmlDescription } from "../disbursement/data";
import { formatNumber } from "@/utils/number-formatter";
import dayjs from "dayjs";

export const accountingExpensesOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
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
  { id: "3", label: "Property Name", accessor: "name" },
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


// Raw API response interfaces
export interface ExpenseApiItem {
  id: number;
  property: string;
  description: string;
  amount: string;
  payment: string;
  balance: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseStatsApi {
  total_amount: string;
  total_deduct: string;
  total_balance: string;
  percentage_change_amount: number;
  percentage_change_deduct: number;
  percentage_change_balance: number;
}

export interface ExpensesApiResponse {
  status: string;
  message: string;
  data: {
    expenses: ExpenseApiItem[];
    statistic: ExpenseStatsApi;
  };
}
export interface Expense {
  id: number;
  picture: string; // fallback if no picture is provided
  date: string;
  name: string;
  description: string;
  amount?: number | string;
  payment?: number | string;
  balance?: number | string;
}

export interface ExpenseStats {
  total_amount?: number | string;
  total_deduct?: number | string;
  total_balance?: number | string;
  percentage_change_amount: number;
  percentage_change_deduct: number;
  percentage_change_balance: number;
}

export interface TransformedExpensesData {
  expenses: Expense[];
  stats: ExpenseStats;
}


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
    percentage_change_amount: apiResponse.data.statistic.percentage_change_amount,
    percentage_change_deduct: apiResponse.data.statistic.percentage_change_deduct,
    percentage_change_balance: apiResponse.data.statistic.percentage_change_balance,
  };

  return { expenses, stats };
};




export const createExpense = async (data: any) => {
  try {
    const res = await api.post(`/expenses`, data)
    if (res.status === 201) {
      return true
    }
  } catch (error) {
    handleAxiosError(error)
    return false
  }
}