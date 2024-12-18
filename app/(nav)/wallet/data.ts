import { ChartConfig } from "@/components/ui/chart";
import type { Field } from "@/components/Table/types";
import api, { handleAxiosError } from "@/services/api";

export const walletChartConfig = {
  totalfunds: {
    label: "Total funds",
    color: "#38BDF8",
  },
  credit: {
    label: "Credit",
    color: "#2DD4BF ",
  },
  debit: {
    label: "Debit",
    color: "#E9212E",
  },
} satisfies ChartConfig;

export const walletChartData = [
  { date: "2024-09-01", totalfunds: 70, credit: 30, debit: 30 },
  { date: "2024-09-02", totalfunds: 100, credit: 60, debit: 30 },
  { date: "2024-09-03", totalfunds: 40, credit: 20, debit: 30 },
  { date: "2024-09-08", totalfunds: 120, credit: 80, debit: 30 },
  { date: "2024-08-18", totalfunds: 70, credit: 50, debit: 30 },
  { date: "2024-08-20", totalfunds: 150, credit: 90, debit: 30 },
  { date: "2024-08-28", totalfunds: 100, credit: 60, debit: 30 },
  { date: "2024-09-30", totalfunds: 140, credit: 10, debit: 300 },
  { date: "2024-12-04", totalfunds: 140, credit: 10, debit: 300 },
];

export const walletTableFields: Field[] = [
  { id: "1", accessor: "icon" },
  { id: "2", label: "Transaction ID", accessor: "transaction_id" },
  { id: "3", label: "Source", accessor: "source" },
  { id: "4", label: "Description", accessor: "description" },
  { id: "5", label: "Amount", accessor: "amount" },
  {
    id: "6",
    label: "Status",
    accessor: "status",
    cellStyle: { color: "#3F4247" },
  },
  { id: "7", label: "Date", accessor: "date" },
  { id: "8", label: "Time", accessor: "time" },
];

const sampleSources = ["Debit", "Wallet Top-up", "Withdrawal", "Received"];

const sampleDescriptions = [
  "Paid for Services",
  "Lodgement Renewal",
  "Deposit Refund",
  "Lodgement Fee",
];

const sampleStatuses = ["Successful", "Pending", "Failed"];

const generateWalletTableData = (numRows: number) =>
  Array.from({ length: numRows }, (_, index) => ({
    id: index + 1,
    transaction_id: `TXN${index + 1}`,
    transaction_type: sampleSources[index % sampleSources.length],
    source: sampleSources[index % sampleSources.length],
    description: sampleDescriptions[index % sampleDescriptions.length],
    amount: `${Math.random() > 0.5 ? "-" : "+"}₦${
      Math.floor(Math.random() * 1000) + 10023
    }`,
    status: sampleStatuses[index % sampleStatuses.length],
    date: "12/01/2024",
    time: "03:30 PM",
  }));

export const determineTrend = (
  value1: string | number,
  value2: string | number
) => {
  const num1 = Number(value1);
  const num2 = Number(value2);

  if (num1 > num2) {
    return "up";
  } else if (num1 < num2) {
    return "down";
  } else {
    return "equal";
  }
};

export const determinePercentageDifference = (
  value1: string | number,
  value2: string | number
) => {
  const num1 = Number(value1);
  const num2 = Number(value2);

  if (num1 === 0 && num2 === 0) {
    return "0.00";
  }

  const difference = ((num1 - num2) / Math.abs(num2)) * 100;

  return difference > 0
    ? `${difference.toFixed(2)}`
    : `${Math.abs(difference).toFixed(2)}`;
};

export const walletTableData = generateWalletTableData(10);

export interface WalletDataResponse {
  stats: {
    current_day: {
      total_funds: string;
      total_credit: string;
      total_debit: string;
    };
    before_current_day: {
      total_funds: string;
      total_credit: string;
      total_debit: string;
    };
  };
  balance: {
    wallet_id: string;
    my_balance: string;
    escrow_balance: string;
    earned_bonus: string;
    pin_status: boolean;
  };
  account: {
    account_number: string;
    account_name: string;
    bank: string;
    customer_code: string;
  };
  transactions: any[]; //confirm with backend
  beneficiaries: any[]; //confirm with backend
}
