import { currencySymbols, formatNumber } from "@/utils/number-formatter";
import { Transactions } from "../types";
import { AllBranchTransactionsResponse, Transaction } from "./types";
import { TransactionPageData } from "@/app/(nav)/wallet/transaction-history/types";

export const transformWalletChartData = (
  transactions: Transactions[],
  creditTypes = ["credit"],
  debitTypes = ["debit"]
) => {
  return transactions.map((t) => {
    const amount = Number(
      t.amount.replace(currencySymbols.naira, "").replace(/,/g, "")
    );
    return {
      date: t.date,
      totalfunds: creditTypes.includes(t.type)
        ? amount
        : debitTypes.includes(t.type)
        ? -amount
        : 0,
      credit: creditTypes.includes(t.type) ? amount : 0,
      debit: debitTypes.includes(t.type) ? amount : 0,
    };
  });
};


export const initialPageData: TransactionPageData = {
  current_page: 1,
  total_pages: 1,
  hasMore: true,
  transactions: [],
};

export const transformAllTransactionsResponse = (
  response: AllBranchTransactionsResponse
): TransactionPageData => {
  const { data } = response;
  return {
    current_page: data.current_page,
    total_pages: data.last_page,
    hasMore: data.current_page < data.last_page,
    transactions: data.data.map((t:any) => {
      const serverDateTime = new Date(t.created_at);

      // Get the user's time zone
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Convert to user's local time
      const localDateTime = new Date(
        serverDateTime.toLocaleString("en-US", { timeZone: userTimeZone })
      );

      // Format the date and time
      const formattedDate = localDateTime.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const formattedTime = localDateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });

      return {
        ...t,
        date: formattedDate,
        time: formattedTime,
        source: t.from,
        amount:
          currencySymbols.naira +
          formatNumber(t.amount, { forceTwoDecimals: true }),
      };
    }),
  };
};
