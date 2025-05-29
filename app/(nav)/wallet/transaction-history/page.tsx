"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import {
  walletTableFields,
  computeStatsTotals,
  determinePercentageDifference,
  determineTrend,
} from "../data";
import {
  initialPageData,
  transactionHistoryFilterMenu,
  transformAllTransactionsResponse,
} from "./data";
import TableLoading from "@/components/Loader/TableLoading";
import useFetch from "@/hooks/useFetch";
import type { AllTransactionsResponse, TransactionQueryParams } from "./types";
import type { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import NetworkError from "@/components/Error/NetworkError";
import { getTransactionIcon } from "@/components/Wallet/icons";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";
import WalletAnalfilteredTransactionsytics from "@/components/Wallet/wallet-analytics";
import { DateRangeSelector } from "./components";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";

const TransactionHistory = () => {
  const [state, setState] = useState(initialPageData);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const timeRange = useGlobalStore((s) => s.timeRange);
  const selectedDateRange = useGlobalStore((s) => s.selectedDateRange);
  const filteredTransactions = useGlobalStore((s) => s.wallet_transactions);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
    } as TransactionQueryParams,
  });
  const observer = useRef<IntersectionObserver | null>(null);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    error,
    isNetworkError,
  } = useFetch<AllTransactionsResponse>("transactions", config);

  // Compute stats for filtered transactions
  const currentTotals = computeStatsTotals(
    state.transactions,
    selectedDateRange
  );

  // Compute totals for the previous period
  const previousRange = (() => {
    if (!selectedDateRange?.from || !selectedDateRange?.to) {
      return undefined;
    }
    const fromDate = new Date(selectedDateRange.from);
    const toDate = new Date(selectedDateRange.to);
    const rangeDays =
      Math.ceil(
        (toDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;
    const previousFrom = new Date(fromDate);
    previousFrom.setDate(fromDate.getDate() - rangeDays);
    const previousTo = new Date(fromDate);
    previousTo.setDate(fromDate.getDate() - 1);
    return { from: previousFrom, to: previousTo };
  })();

  const previousTotals = computeStatsTotals(state.transactions, previousRange);

  // Percentage differences and trends
  const fundsPercent = determinePercentageDifference(
    previousTotals.total_funds,
    currentTotals.total_funds
  );
  const fundsUpDown = determineTrend(
    currentTotals.total_funds,
    previousTotals.total_funds
  );

  const debitPercent = determinePercentageDifference(
    previousTotals.total_debit,
    currentTotals.total_debit
  );
  const debitUpDown = determineTrend(
    currentTotals.total_debit,
    previousTotals.total_debit
  );

  const creditPercent = determinePercentageDifference(
    previousTotals.total_credit,
    currentTotals.total_credit
  );
  const creditUpDown = determineTrend(
    currentTotals.total_credit,
    previousTotals.total_credit
  );

  // Save stats and date range to global store
  useEffect(() => {
    console.log("Saving to global store:", {
      wallet_stats: {
        total_funds: currentTotals.total_funds,
        total_debit: currentTotals.total_debit,
        total_credit: currentTotals.total_credit,
        funds_trend: {
          from: `previous ${
            timeRange === "90d"
              ? "3 months"
              : timeRange === "30d"
              ? "30 days"
              : timeRange === "7d"
              ? "7 days"
              : timeRange === "1d"
              ? "day"
              : "period"
          }`,
          type: fundsUpDown as "up" | "down" | "none",
          percent: Number(fundsPercent),
        },
        debit_trend: {
          from: `previous ${
            timeRange === "90d"
              ? "3 months"
              : timeRange === "30d"
              ? "30 days"
              : timeRange === "7d"
              ? "7 days"
              : timeRange === "1d"
              ? "day"
              : "period"
          }`,
          type: debitUpDown as "up" | "down" | "none",
          percent: Number(debitPercent),
        },
        credit_trend: {
          from: `previous ${
            timeRange === "90d"
              ? "3 months"
              : timeRange === "30d"
              ? "30 days"
              : timeRange === "7d"
              ? "7 days"
              : timeRange === "1d"
              ? "day"
              : "period"
          }`,
          type: creditUpDown as "up" | "down" | "none",
          percent: Number(creditPercent),
        },
      },
      wallet_date_range: { timeRange, selectedDateRange },
    });

    setGlobalStore("wallet_stats", {
      total_funds: currentTotals.total_funds,
      total_debit: currentTotals.total_debit,
      total_credit: currentTotals.total_credit,
      funds_trend: {
        from: `previous ${
          timeRange === "90d"
            ? "3 months"
            : timeRange === "30d"
            ? "30 days"
            : timeRange === "7d"
            ? "7 days"
            : timeRange === "1d"
            ? "day"
            : "period"
        }`,
        type: fundsUpDown as "up" | "down" | "none",
        percent: Number(fundsPercent),
      },
      debit_trend: {
        from: `previous ${
          timeRange === "90d"
            ? "3 months"
            : timeRange === "30d"
            ? "30 days"
            : timeRange === "7d"
            ? "7 days"
            : timeRange === "1d"
            ? "day"
            : "period"
        }`,
        type: debitUpDown as "up" | "down" | "none",
        percent: Number(debitPercent),
      },
      credit_trend: {
        from: `previous ${
          timeRange === "90d"
            ? "3 months"
            : timeRange === "30d"
            ? "30 days"
            : timeRange === "7d"
            ? "7 days"
            : timeRange === "1d"
            ? "day"
            : "period"
        }`,
        type: creditUpDown as "up" | "down" | "none",
        percent: Number(creditPercent),
      },
    });
    setGlobalStore("wallet_date_range", { timeRange, selectedDateRange });
  }, [
    currentTotals,
    fundsPercent,
    fundsUpDown,
    debitPercent,
    debitUpDown,
    creditPercent,
    creditUpDown,
    timeRange,
    selectedDateRange,
    setGlobalStore,
  ]);

  // Update fetchNextPage with better logging
  const fetchNextPage = useCallback(() => {
    if (!state.hasMore || silentLoading || loading) {
      return;
    }

    const nextPage = state.current_page + 1;
    if (nextPage <= state.total_pages) {
      setConfig((prev) => ({
        ...prev,
        params: {
          ...prev.params,
          page: nextPage,
        } as TransactionQueryParams,
      }));
    }
  }, [
    state.hasMore,
    silentLoading,
    loading,
    state.current_page,
    state.total_pages,
  ]);

  // Update the IntersectionObserver setup
  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (!node || loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && state.hasMore && !silentLoading) {
            fetchNextPage();
          }
        },
        {
          root: document.getElementById("table-container"),
          rootMargin: "100px",
          threshold: 0.1,
        }
      );

      observer.current.observe(node);

      // Debug log when ref is attached
      console.log("Observer attached to element", {
        hasMore: state.hasMore,
        currentPage: state.current_page,
        totalPages: state.total_pages,
      });
    },
    [
      fetchNextPage,
      state.hasMore,
      silentLoading,
      loading,
      state.current_page,
      state.total_pages,
    ]
  );
  
  useEffect(() => {
    if (apiData) {
      setState((prevState) => {
        const newTransactions = transformAllTransactionsResponse(apiData);
        const combinedTransactions = [
          ...prevState.transactions,
          ...newTransactions.transactions,
        ];
        const uniqueTransactions = combinedTransactions.filter(
          (transaction, index, self) =>
            index === self.findIndex((t) => t.id === transaction.id)
        );

        // Save unique transactions to global store
        setGlobalStore("wallet_transactions", uniqueTransactions);

        if (newTransactions.current_page === 1) {
          return {
            ...prevState,
            ...newTransactions,
            transactions: uniqueTransactions,
          };
        } else {
          return {
            ...prevState,
            transactions: uniqueTransactions,
            current_page: newTransactions.current_page,
            total_pages: newTransactions.total_pages,
            hasMore: newTransactions.hasMore,
          };
        }
      });
    }
  }, [apiData, setGlobalStore]);

  const transformedWalletTableData = state.transactions.map((t, index) => ({
    ...t,
    amount: (
      <span
        className={clsx({
          "text-status-success-3": t.type === "credit",
          "text-status-error-primary": t.type === "debit",
        })}
      >
        {`${t.type === "credit" ? "+" : t.type === "debit" ? "-" : ""}${
          t.amount
        }`}
      </span>
    ),
    status: (
      <span
        className={clsx("font-medium", {
          "text-yellow-500": t.status?.toLowerCase() === "pending",
          "text-status-error-primary": t.status?.toLowerCase() === "failed",
          "text-status-success-3": t.status?.toLowerCase() === "success",
        })}
      >
        {t.status}
      </span>
    ),
    icon: (
      <div
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-full",
          {
            "bg-status-error-1 text-status-error-primary": t.type === "debit",
            "bg-status-success-1 text-status-success-primary":
              t.type === "credit" || t.type === "DVA",
          }
        )}
      >
        {getTransactionIcon(t.source, t.transaction_type)}
      </div>
    ),
    ref: index === state.transactions.length - 1 ? lastRowRef : null,
  }));

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const queryParams: TransactionQueryParams = {
      page: 1,
    };
    const status = menuOptions["Status"]?.[0];
    const type = menuOptions["Type"]?.[0];
    if (startDate) {
      queryParams.from = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.to = dayjs(endDate).format("YYYY-MM-DD");
    }
    if (status) {
      queryParams.status = status;
    }
    if (type) {
      queryParams.transaction_type = type;
    }
    // Reset transactions to avoid stale data
    setState((prevState) => ({
      ...prevState,
      transactions: [],
      current_page: 1,
      hasMore: true,
    }));
    setConfig({
      params: queryParams,
    });
  };

  // Get display text for current timeRange
  const getTimeRangeDisplayText = () => {
    switch (timeRange) {
      case "90d":
        return "Last 3 months";
      case "30d":
        return "Last 30 days";
      case "7d":
        return "Last 7 days";
      case "1d":
        return "Yesterday";
      case "custom":
        return "Custom";
      default:
        return "Last 30 days";
    }
  };

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="flex justify-between items-center">
        <FilterBar
          pageTitle="Transaction History"
          hasGridListToggle={false}
          handleFilterApply={handleFilterApply}
          hiddenSearchInput
          exports
          isDateTrue
          exportHref="/wallet/audit-trail/export"
          filterOptionsMenu={transactionHistoryFilterMenu}
          appliedFilters={appliedFilters}
          fileLabel={"Wallet Transactions"}
          xlsxData={filteredTransactions}
          onBack
        />
        {/* <DateRangeSelector /> */}
      </div>
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="custom-flex-col gap-10 flex-1">
          <div className="flex flex-col lg:flex-row gap-6">
            <WalletAnalytics
              title="funds"
              amount={currentTotals.total_funds}
              trend={{
                from: `previous ${
                  timeRange === "90d"
                    ? "3 months"
                    : timeRange === "30d"
                    ? "30 days"
                    : timeRange === "7d"
                    ? "7 days"
                    : timeRange === "1d"
                    ? "day"
                    : "period"
                }`,
                type: fundsUpDown as "up" | "down" | "none",
                percent: Number(fundsPercent),
              }}
            />
            <WalletAnalytics
              title="debit"
              amount={currentTotals.total_debit}
              trend={{
                from: `previous ${
                  timeRange === "90d"
                    ? "3 months"
                    : timeRange === "30d"
                    ? "30 days"
                    : timeRange === "7d"
                    ? "7 days"
                    : timeRange === "1d"
                    ? "day"
                    : "period"
                }`,
                type: debitUpDown as "up" | "down" | "none",
                percent: Number(debitPercent),
              }}
            />
            <WalletAnalytics
              title="credit"
              amount={currentTotals.total_credit}
              trend={{
                from: `previous ${
                  timeRange === "90d"
                    ? "3 months"
                    : timeRange === "30d"
                    ? "30 days"
                    : timeRange === "7d"
                    ? "7 days"
                    : timeRange === "1d"
                    ? "day"
                    : "period"
                }`,
                type: creditUpDown as "up" | "down" | "none",
                percent: Number(creditPercent),
              }}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <TableLoading />
      ) : (
        <section>
          <CustomTable
            fields={walletTableFields}
            data={transformedWalletTableData}
            tableBodyCellSx={{
              paddingTop: "12px",
              paddingBottom: "12px",
              fontSize: "16px",
              whiteSpace: "nowrap",
            }}
            tableHeadCellSx={{
              paddingTop: "14px",
              paddingBottom: "14px",
              fontSize: "16px",
            }}
          />
          <div className="h-10 w-full">
            {silentLoading && (
              <div className="flex items-center justify-center py-4">
                <div className="loader" />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default TransactionHistory;
