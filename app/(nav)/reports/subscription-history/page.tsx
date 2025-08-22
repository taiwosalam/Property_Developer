"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { useGlobalStore } from "@/store/general-store";
import { useSearchParams } from "next/navigation";
import { AxiosRequestConfig } from "axios";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { EnrollmentApiResponse } from "../../settings/subscription/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { transformEnrollmentHistory } from "./data";
import clsx from "clsx";
import { enrollment_subscriptions } from "../../settings/add-on/data";
import dayjs from "dayjs";
import { ReportsRequestParams } from "../tenants/data";
import { debounce } from "lodash";
import { FilterResult } from "../tenants/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";

interface EnrollmentQueryParams {
  page?: number;
}

const SubscriptionRecord = () => {
  const searchParams = useSearchParams();
  const search = searchParams.get("b");
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const { company_id } = usePersonalInfoStore();

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const [state, setState] = useState<{
    transactions: DataItem[];
    current_page: number;
    total_pages: number;
    hasMore: boolean;
  }>({
    transactions: [],
    current_page: 1,
    total_pages: 1,
    hasMore: false,
  });

  const [config, setConfig] = useState<AxiosRequestConfig>();

  const observer = useRef<IntersectionObserver | null>(null);

  // Reset config/state when company_id changes
  useEffect(() => {
    if (company_id) {
      setConfig({
        params: { page: 1 } as EnrollmentQueryParams,
      });
      setState({
        transactions: [],
        current_page: 1,
        total_pages: 1,
        hasMore: false,
      });
    }
  }, [company_id]);

  const {
    data: companyEnrollments,
    error: enrollmentErr,
    loading,
    silentLoading,
    isNetworkError,
    refetch: refetchEnrollments,
  } = useFetch<EnrollmentApiResponse>(
    company_id && config ? `/enrollments/${company_id}` : null,
    config
  );

  // useRefetchOnEvent("refetchEnrollments", () =>
  //   company_id && config ? refetchEnrollments({ silent: true }) : null
  // );

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config?.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config?.params, sort_order: order } });
  };

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const branch = menuOptions["Branch"] || [];
      const property = menuOptions["Property"] || [];

      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (branch.length > 0) queryParams.branch_id = branch.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  // Always update state when new data is fetched
  useEffect(() => {
    if (!loading && companyEnrollments?.data?.enrollments) {
      const newData = transformEnrollmentHistory(
        companyEnrollments.data.enrollments,
        companyEnrollments.data.pagination
      );
      setState((prevState) => {
        const combinedTransactions =
          newData.current_page === 1
            ? newData.transactions
            : [...prevState.transactions, ...newData.transactions];

        // Remove duplicates based on id
        const uniqueTransactions = combinedTransactions.filter(
          (transaction, index, self) =>
            index === self.findIndex((t) => t.id === transaction.id)
        );
        return {
          ...prevState,
          transactions: uniqueTransactions,
          current_page: newData.current_page,
          total_pages: newData.total_pages,
          hasMore: newData.hasMore,
        };
      });
      setGlobalStore("subscriptions", newData.transactions);
    }
  }, [companyEnrollments, loading, setGlobalStore]);

  // Fetch next page for infinite scroll
  const fetchNextPage = useCallback(() => {
    if (!state.hasMore || silentLoading || loading) {
      return;
    }
    const nextPage = state.current_page + 1;
    if (nextPage <= state.total_pages) {
      setConfig((prev) => ({
        ...prev,
        params: {
          ...(prev?.params || {}),
          page: nextPage,
        } as EnrollmentQueryParams,
      }));
    }
  }, [
    state.hasMore,
    silentLoading,
    loading,
    state.current_page,
    state.total_pages,
  ]);

  // Set up IntersectionObserver for infinite scroll
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
    },
    [fetchNextPage, state.hasMore, silentLoading, loading]
  );

  const transformedTableData = state.transactions.map((t, index) => ({
    ...t,
    status: (
      <span
        className={clsx("font-medium", {
          "text-status-success-3": t.status.toLowerCase() === "active",
          "text-status-error-primary":
            t.status.toLowerCase() === "inactive" ||
            t.status.toLowerCase() === "failed",
          "text-yellow-500": t.status.toLowerCase() === "pending",
        })}
      >
        {t.status}
      </span>
    ),
    ref: index === state.transactions.length - 1 ? lastRowRef : null,
  }));

  if (loading)
    return (
      <CustomLoader
        layout="page"
        view="table"
        pageTitle="Subscription history"
      />
    );
  if (isNetworkError) return <NetworkError />;
  if (enrollmentErr) return <ServerError error={enrollmentErr} />;

  return (
    <div className="space-y-9">
      <FilterBar
        exports
        isDateTrue
        onBack={!!search}
        pageTitle="Subscription History"
        aboutPageModalData={{
          title: "Subscription History",
          description:
            "This page contains a list of listing subscription history",
        }}
        searchInputPlaceholder="Search for subscriptions"
        handleFilterApply={handleAppliedFilter}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
        hasGridListToggle={false}
        exportHref="/reports/subscription-history/export"
        xlsxData={state?.transactions}
        fileLabel={"Subscriptions"}
      />

      <section>
        {state?.transactions.length === 0 && !loading ? (
          !!config?.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title=" No Previous Subscription Record Found"
              body={
                <p>
                  You currently do not have any previous records associated with
                  this subscription plan. Once you subscribe, your subscription
                  history and related details will appear here for future
                  reference and tracking.
                  <br />
                  <br />
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={enrollment_subscriptions.fields}
            data={transformedTableData}
            tableHeadClassName="h-[45px]"
          />
        )}
        <>
          {silentLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="loader" />
            </div>
          )}
        </>
      </section>
    </div>
  );
};

export default SubscriptionRecord;
