import { ChartConfig } from "@/components/ui/chart";
import type { Field } from "@/components/Table/types";
import {
  tierColorMap,
  type BadgeIconColors,
} from "@/components/BadgeIcon/badge-icon";
import type { Beneficiary } from "@/store/wallet-store";
import { DateRange } from "react-day-picker";
import { parseCurrency } from "../accounting/expenses/[expenseId]/manage-expenses/data";

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
  { id: "2", label: "Transaction ID", accessor: "id" },
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
    return 0;
  }

  if (num2 === 0) {
    return Math.min(100, Math.round(Math.abs(num1))); // Ensure it stays within the range
  }

  const percentage = Math.round((Math.abs(num1 - num2) / Math.abs(num2)) * 100);

  // Always return a value between 0 and 100
  return Math.min(100, percentage);
};

// Compute totals based on selected time range
export const computeTotals = (
  transactions: any[],
  range: DateRange | undefined
) => {
  if (!range?.from || !range?.to) {
    return { total_funds: 0, total_debit: 0, total_credit: 0 };
  }

  const filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= range.from! && date <= range.to!;
  });

  // Log filtered transactions for debugging
  console.log("Filtered transactions:", filtered);

  const totals = filtered.reduce(
    (acc, t) => {
      const amount = Number(t.amount);
      // Determine if the transaction is a credit based on type or transaction_type
      const isCredit =
        t.type === "credit" ||
        t.type === "DVA" ||
        t.transaction_type === "funding" ||
        t.transaction_type === "transfer_in";

      if (isCredit) {
        acc.total_credit += amount;
      } else if (
        t.type === "debit" ||
        t.transaction_type === "withdrawal" ||
        t.transaction_type === "sponsor_listing" ||
        t.transaction_type === "transfer_out"
      ) {
        acc.total_debit += amount;
      }

      return acc;
    },
    { total_funds: 0, total_debit: 0, total_credit: 0 }
  );

  // Calculate total_funds as the sum of total_credit and total_debit
  totals.total_funds = totals.total_credit + totals.total_debit;

  // Log computed totals for debugging
  console.log("Computed totals:", totals);

  return {
    ...totals,
    total_funds: Math.max(0, totals.total_funds), // Ensure non-negative
  };
};

export const computeStatsTotals = (
  transactions: any[],
  range: DateRange | undefined
) => {
  if (!range?.from || !range?.to) {
    return { total_funds: 0, total_debit: 0, total_credit: 0 };
  }

  const filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= range.from! && date <= range.to!;
  });

  console.log("Filtered transactions:", filtered); // For debugging

  const totals = filtered.reduce(
    (acc, t) => {
      const amount = parseCurrency(t.amount);
      const isCredit =
        t.type === "credit" ||
        t.type === "DVA" ||
        t.transaction_type === "funding" ||
        t.transaction_type === "transfer_in";

      if (isCredit) {
        acc.total_credit += amount;
      } else if (
        t.type === "debit" ||
        t.transaction_type === "withdrawal" ||
        t.transaction_type === "sponsor_listing" ||
        t.transaction_type === "transfer_out"
      ) {
        acc.total_debit += amount;
      }

      return acc;
    },
    { total_funds: 0, total_debit: 0, total_credit: 0 }
  );

  totals.total_funds = totals.total_credit + totals.total_debit;

  console.log("Computed totals:", totals); // For debugging

  return {
    ...totals,
    total_funds: Math.max(0, totals.total_funds),
  };
};

export interface WalletDataResponse {
  stats: {
    current_day: {
      total_funds: string;
      total_credit: string;
      total_debit: string;
    };
    previous_month: {
      total_funds: string;
      total_credit: string;
      total_debit: string;
    };
  };
  balance: {
    id: string;
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
  transactions: {
    id: string;
    amount: string;
    source: string;
    description: string;
    status: string;
    transaction_type:
      | "withdrawal"
      | "sponsor_listing"
      | "transfer_out"
      | "transfer_in"
      | "debit"
      | "funding";
    date: string;
    time: string;
    type: "credit" | "debit" | "DVA";
  }[];
  beneficiaries: {
    id: string;
    beneficiary_name: string;
    beneficiary_picture: string | null;
    beneficiary_wallet_id: string;
    tier_id: null | 1 | 2 | 3 | 4 | 5;
    is_verified: "0" | "1" | 0 | 1;
  }[];
}

export const transformBeneficiaries = (
  beneficiaries: WalletDataResponse["beneficiaries"]
): Beneficiary[] => {
  return beneficiaries.map((b) => {
    let badgeColor: BadgeIconColors | undefined;
    if (b.is_verified === 1 || b.is_verified === "1") {
      badgeColor = "gray"; // Company wallet and verified
    } else if (b.tier_id) {
      badgeColor = tierColorMap[b.tier_id]; // User wallet with tier
    }
    return {
      id: b.id,
      name: b.beneficiary_name,
      picture: b.beneficiary_picture,
      wallet_id: b.beneficiary_wallet_id,
      badge_color: badgeColor,
    };
  });
};

export interface WalletStats {
  total_funds: number;
  total_debit: number;
  total_credit: number;
  funds_trend: {
    from:
      | "last month"
      | "last week"
      | "none"
      | "previous day"
      | "previous 3 months"
      | "previous 30 days"
      | "previous 7 days"
      | "previous period";
    type: "up" | "down" | "none" | "equal";
    percent: number;
  };
  debit_trend: {
    from:
      | "last month"
      | "last week"
      | "none"
      | "previous day"
      | "previous 3 months"
      | "previous 30 days"
      | "previous 7 days"
      | "previous period";
    type: "up" | "down" | "none" | "equal";
    percent: number;
  };
  credit_trend: {
    from:
      | "last month"
      | "last week"
      | "none"
      | "previous day"
      | "previous 3 months"
      | "previous 30 days"
      | "previous 7 days"
      | "previous period";
    type: "up" | "down" | "none" | "equal";
    percent: number;
  };
}
