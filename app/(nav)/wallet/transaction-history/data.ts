import type { TransactionPageData, AllTransactionsResponse } from "./types";
import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import { currencySymbols, formatNumber } from "@/utils/number-formatter";

export const transactionHistoryFilterMenu: FilterOptionMenu[] = [
  {
    label: "Status",
    radio: true,
    value: [
      { label: "Pending", value: "pending" },
      { label: "Failed", value: "failed" },
      { label: "Success", value: "success" },
    ],
  },
  {
    label: "Type",
    radio: true,
    value: [
      // { label: "Credit", value: "credit" },
      // { label: "Debit", value: "debit" },
      { label: "Withdrawal", value: "withdrawal" },
      { label: "Transfer Out", value: "transfer_out" },
      { label: "Transfer In", value: "transfer_in" },
      { label: "Funding", value: "funding" },
      { label: "Others", value: "sponsor_listing" },
    ],
  },
];

export const initialPageData: TransactionPageData = {
  current_page: 1,
  total_pages: 1,
  hasMore: true,
  transactions: [],
};

export const transformAllTransactionsResponse = (
  response: AllTransactionsResponse
): TransactionPageData => {
  const { data } = response;
  return {
    current_page: data.current_page,
    total_pages: data.last_page,
    hasMore: data.current_page < data.last_page,
    transactions: data.data.map((t) => {
      // Parse the date and time strings into a Date object (assuming UTC from server)
      const dateTimeString = `${t.date}T${t.time}Z`; // Add 'Z' to indicate UTC
      const serverDateTime = new Date(dateTimeString);

      // Get the user's time zone (replace with your actual method)
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; //Gets from browser

      // Convert to user's local time
      const localDateTime = new Date(
        serverDateTime.toLocaleString("en-US", { timeZone: userTimeZone })
      );

      // Format the date and time as needed
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
        amount:
          currencySymbols.naira +
          formatNumber(t.amount, { forceTwoDecimals: true }),
      };
    }),
  };
};
