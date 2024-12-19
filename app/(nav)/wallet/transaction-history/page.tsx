"use client";

// Imports
import { useState, useEffect, useRef, useCallback } from "react";
import clsx from "clsx";
import BackButton from "@/components/BackButton/back-button";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CustomTable from "@/components/Table/table";
import {
  RedOutgoingIcon,
  GreenIncomingIcon,
  BlueIncomingIcon,
} from "@/components/Accounting/icons";
import { BlueBuildingIcon } from "@/public/icons/dashboard-cards/icons";
import { walletTableFields } from "../data";
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

const TransactionHistory = () => {
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
  } = useFetch<AllTransactionsResponse>("transactions", config);

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
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.hasMore) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [fetchNextPage, loading, state.hasMore]
  );

  useEffect(() => {
    if (apiData) {
      setState((prevState) => {
        const newTransactions = transformAllTransactionsResponse(apiData);

        // Check if page number is 1 to decide whether to overwrite or append
        if (newTransactions.current_page === 1) {
          // Overwrite transactions for the first page (e.g., after applying filters)
          return {
            ...prevState,
            ...newTransactions,
          };
        } else {
          // Append transactions for subsequent pages (e.g., scrolling)
          return {
            ...prevState,
            transactions: [
              ...prevState.transactions,
              ...newTransactions.transactions,
            ],
            current_page: newTransactions.current_page,
            total_pages: newTransactions.total_pages,
            hasMore: newTransactions.hasMore,
          };
        }
      });
    }
  }, [apiData]);

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
          "flex items-center justify-center w-9 h-9 rounded-full"
        )}
      >
        <GreenIncomingIcon size={25} />
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

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="custom-flex-col gap-8">
      <BackButton>Transaction History</BackButton>
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
      />

      {loading || silentLoading ? (
        <TableLoading />
      ) : (
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
      )}
    </div>
  );
};

export default TransactionHistory;
