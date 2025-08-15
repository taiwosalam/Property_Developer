"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import {
  walletTableFields,
  computeStatsTotals,
  determinePercentageDifference,
  determineTrend,
} from "@/app/(nav)/wallet/data";
import { transactionHistoryFilterMenu } from "@/app/(nav)/wallet/transaction-history/data";
import TableLoading from "@/components/Loader/TableLoading";
import useFetch from "@/hooks/useFetch";
import type {
  AllBranchTransactionsResponse,
  TransactionQueryParams,
} from "./types";
import type { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import NetworkError from "@/components/Error/NetworkError";
import { getTransactionIcon } from "@/components/Wallet/icons";
import { useGlobalStore } from "@/store/general-store";
import ServerError from "@/components/Error/ServerError";
import WalletAnalytics from "@/components/Wallet/wallet-analytics";
import { DateRangeSelector } from "@/app/(nav)/wallet/transaction-history/components";
import {
  transformAllTransactionsResponse,
  transformWalletChartData,
  initialPageData,
} from "./dat";

const BranchTransactionsPage = ({
  params,
}: {
  params: { branchId: string };
}) => {
  const { branchId } = params;
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const timeRange = useGlobalStore((s) => s.timeRange);
  const selectedDateRange = useGlobalStore((s) => s.selectedDateRange);
  const filteredTransactions = useGlobalStore((s) => s.wallet_transactions);

  const [state, setState] = useState(initialPageData);
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
  } = useFetch<AllBranchTransactionsResponse>(
    `branch/${branchId}/transactions`,
    config
  );

  // Transform API data and update state
  useEffect(() => {
    if (apiData) {
      const newTransactions = transformAllTransactionsResponse(apiData);
      const combinedTransactions = [
        ...state.transactions,
        ...newTransactions.transactions,
      ];
      const uniqueTransactions = combinedTransactions.filter(
        (transaction, index, self) =>
          index === self.findIndex((t) => t.id === transaction.id)
      );

      // Update global store with JSON.stringify comparison
      const currentTransactions =
        useGlobalStore.getState()?.wallet_transactions;
      if (
        JSON.stringify(currentTransactions) !==
        JSON.stringify(uniqueTransactions)
      ) {
        console.log("Updating wallet_transactions:", uniqueTransactions);
        setGlobalStore("wallet_transactions", uniqueTransactions);
      }

      setState((prevState) => ({
        ...prevState,
        transactions: uniqueTransactions,
        current_page: newTransactions.current_page,
        total_pages: newTransactions.total_pages,
        hasMore: newTransactions.hasMore,
      }));
    }
  }, [apiData, setGlobalStore]);

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

  const fetchNextPage = useCallback(() => {
    if (state.hasMore && !silentLoading) {
      setConfig((prev) => ({
        params: {
          ...prev.params,
          page: state.current_page + 1,
        } as TransactionQueryParams,
      }));
    }
  }, [state.hasMore, silentLoading, state.current_page]);

  const lastRowRef = useCallback(
    (node: HTMLElement | null) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMore) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, state.hasMore]
  );

  // Transform transactions for table display
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
    icon: (
      <div
        className={clsx(
          "flex items-center justify-center w-9 h-9 rounded-full",
          {
            "bg-status-error-1 text-status-error-primary": t.type === "debit",
            "bg-status-success-1 text-status-success-primary":
              t.type === "credit",
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
      queryParams.type = type;
    }
    setConfig({
      params: queryParams,
    });
  };

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="flex justify-between items-center">
        <FilterBar
          pageTitle="Branch Transaction History"
          hasGridListToggle={false}
          handleFilterApply={handleFilterApply}
          hiddenSearchInput
          exports
          isDateTrue
          exportHref="/wallet/audit-trail/export"
          //   exportHref={`/management/staff-branch/${branchId}/transactions/export`}
          filterOptionsMenu={transactionHistoryFilterMenu}
          appliedFilters={appliedFilters}
          fileLabel={"Branch Wallet Transactions"}
          xlsxData={filteredTransactions}
          onBack
        />
        <DateRangeSelector />
      </div>
      <div className="flex flex-col xl:flex-row gap-8">
        <div className="custom-flex-col gap-10 flex-1">
          <div className="flex flex-col lg:flex-row gap-6">
            <WalletAnalytics
              title="funds"
              amount={currentTotals.total_funds}
              trend={{
                from:
                  timeRange === "90d"
                    ? "previous 3 months"
                    : timeRange === "30d"
                    ? "previous 30 days"
                    : timeRange === "7d"
                    ? "previous 7 days"
                    : timeRange === "1d"
                    ? "previous day"
                    : "previous period",
                type: fundsUpDown as "up" | "down" | "none",
                percent: Number(fundsPercent),
              }}
            />
            <WalletAnalytics
              title="debit"
              amount={currentTotals.total_debit}
              trend={{
                from:
                  timeRange === "90d"
                    ? "previous 3 months"
                    : timeRange === "30d"
                    ? "previous 30 days"
                    : timeRange === "7d"
                    ? "previous 7 days"
                    : timeRange === "1d"
                    ? "previous day"
                    : "previous period",
                type: debitUpDown as "up" | "down" | "none",
                percent: Number(debitPercent),
              }}
            />
            <WalletAnalytics
              title="credit"
              amount={currentTotals.total_credit}
              trend={{
                from:
                  timeRange === "90d"
                    ? "previous 3 months"
                    : timeRange === "30d"
                    ? "previous 30 days"
                    : timeRange === "7d"
                    ? "previous 7 days"
                    : timeRange === "1d"
                    ? "previous day"
                    : "previous period",
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
          {silentLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="loader" />
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BranchTransactionsPage;
