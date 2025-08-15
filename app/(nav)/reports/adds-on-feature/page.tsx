"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { useCallback, useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity, Loader2 } from "lucide-react";
import { FeatureFields, SponsorFields } from "../../settings/add-on/data";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  BrandHistoryResponse,
  EnrollmentHistoryTable,
  transformEnrollmentHistory,
} from "@/components/Settings/sponsor_data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const AddsOnFeatureRecord = () => {
  const { company_id } = usePersonalInfoStore();
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredTransactions = useGlobalStore((s) => s.feature_history);

  const [featureTable, setFeatureTable] = useState<EnrollmentHistoryTable>({
    data: [],
    pagination: { total: 0, current_page: 0, last_page: 0 },
  });

  const {
    data: enrollmentData,
    refetch,
    loading,
    isNetworkError,
    error,
  } = useFetch<BrandHistoryResponse>(
    company_id ? `brands/${company_id}` : null,
    config
  );
  //useRefetchOnEvent("buySMS", () => refetch({ silent: true }));

  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastRowRef = useRef<HTMLTableRowElement | null>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (enrollmentData) {
      const transformEnrollment = transformEnrollmentHistory(enrollmentData);
      setFeatureTable(transformEnrollment);
    }
  }, [enrollmentData]);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const handleAppliedFilter = useCallback(
    (filters: FilterResult) => {
      const debouncedFilter = debounce((filters: FilterResult) => {
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
          queryParams.start_date = dayjs(startDate).format(
            "YYYY-MM-DD:hh:mm:ss"
          );
        if (endDate)
          queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
        setConfig({ params: queryParams });
      }, 300);

      debouncedFilter(filters);
    },
    [setAppliedFilters, setConfig]
  );

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  // Handle data transformation and appending for infinite scroll
  useEffect(() => {
    if (enrollmentData) {
      const transData = transformEnrollmentHistory(enrollmentData);
      setFeatureTable((prev) => ({
        ...transData,
        emails:
          config.params.page === 1
            ? transData.data
            : [...prev.data, ...transData.data],
      }));
      //setGlobalStore("emails", transData.emails);
      setIsFetchingMore(false);
    }
  }, [enrollmentData, config.params.page, setGlobalStore]);

  // Set up Intersection Observer for infinite scroll
  useEffect(() => {
    if (
      loading ||
      isFetchingMore ||
      !enrollmentData ||
      featureTable.data.length === 0 ||
      featureTable.pagination.current_page >= featureTable.pagination.last_page
    ) {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setConfig((prev) => ({
            ...prev,
            params: { ...prev.params, page: prev.params.page + 1 },
          }));
          setIsFetchingMore(true);
        }
      },
      {
        root: tableContainerRef.current, // Use TableContainer as the scrollable root
        rootMargin: "20px", // Trigger slightly before the bottom
        threshold: 1.0, // Trigger when the last row is fully visible
      }
    );

    if (lastRowRef.current) {
      observerRef.current.observe(lastRowRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [
    loading,
    isFetchingMore,
    enrollmentData,
    featureTable.data.length,
    featureTable.pagination.current_page,
    featureTable.pagination.last_page,
  ]);
  // }, [loading, isFetchingMore, enrollmentData]);

  useEffect(() => {
    if (!loading && enrollmentData) {
      const transformedData = transformEnrollmentHistory(enrollmentData);
      const enrollmentHistory = transformedData;
      const currentLandlords = useGlobalStore.getState().sms_transaction;
      if (
        JSON.stringify(currentLandlords) !== JSON.stringify(enrollmentHistory)
      ) {
        setGlobalStore("feature_history", enrollmentHistory);
      }
    }
  }, [enrollmentData, loading, setGlobalStore]);

  const searchParams = useSearchParams();
  const search = searchParams.get("b");

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Add-On Feature Listing"
        view="table"
      />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <FilterBar
        exports
        isDateTrue
        onBack={!!search}
        pageTitle="Adds-On Feature"
        aboutPageModalData={{
          title: "Adds-On Feature",
          description: "This page contains a list of listing sponsor history",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleFilterApply={handleAppliedFilter}
        handleSearch={handleSearch}
        appliedFilters={appliedFilters}
        hasGridListToggle={false}
        exportHref="/reports/adds-on-feature/export"
        xlsxData={filteredTransactions?.data.map((activity) => ({
          ...activity,
        }))}
        fileLabel={"Feature Reports"}
      />
      <section>
        {featureTable && featureTable.data.length === 0 && !loading ? (
          !!config.params.search ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Previous Add-On Record Found"
              body={
                <p>
                  You currently do not have any previous records for this
                  add-on. Once you activate or subscribe to this add-on, all
                  related history and usage details will be displayed here for
                  your reference.
                </p>
              }
            />
          )
        ) : (
          <div ref={tableContainerRef} className="py-4">
            <CustomTable
              fields={FeatureFields}
              data={featureTable ? featureTable?.data.slice(0, 7) : []}
              tableHeadClassName="h-[45px]"
            />

            {isFetchingMore && (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-brand-9" />
              </div>
            )}
            {featureTable &&
              featureTable.pagination.current_page >=
                featureTable.pagination.last_page &&
              featureTable.data.length > 0 && (
                <div className="text-center py-4 text-gray-500"></div>
              )}
          </div>
        )}
      </section>
    </div>
  );
};

export default AddsOnFeatureRecord;
