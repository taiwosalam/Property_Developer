"use client";
import CustomTable from "@/components/Table/table";
import type { DataItem } from "@/components/Table/types";
import FilterBar from "@/components/FIlterBar/FilterBar";
// import {
//   reportsListingsFilterOptionsWithDropdown,
//   trackingTableFields,
// } from "./data";
// import {
//   ActivityApiResponse,
//   ActivityTable,
//   transformActivityAData,
// } from "./[userId]/types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import useAddressFromCoords from "@/hooks/useGeoCoding";
import { useGlobalStore } from "@/store/general-store";
import { useRouter, useSearchParams } from "next/navigation";
import { debounce } from "@/utils/debounce";
import { Activity } from "lucide-react";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import {
  BrandHistoryResponse,
  EnrollmentHistoryTable,
  transformEnrollmentHistory,
} from "@/components/Settings/sponsor_data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { FeatureFields } from "@/app/(nav)/settings/add-on/data";

const AddsOnFeatureRecord = () => {
  const { company_id } = usePersonalInfoStore();
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredTransactions = useGlobalStore((s) => s.feature_history);

  const [featureTable, setFeatureTable] =
    useState<EnrollmentHistoryTable | null>(null);

  const {
    data: enrollmentData,
    refetch,
    loading,
    isNetworkError,
    error,
  } = useFetch<BrandHistoryResponse>(`brands/${Number(company_id)}`, config);
  useRefetchOnEvent("buySMS", () => refetch({ silent: true }));

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
        onBack={search ? true : false}
        pageTitle="Adds-On Feature"
        aboutPageModalData={{
          title: "Adds-On Feature",
          description: "This page contains a list of listing sponsor history",
        }}
        searchInputPlaceholder="Search for audit trail"
        handleFilterApply={handleAppliedFilter}
        //={() => {}}
        onSort={() => {}}
        handleSearch={() => {}}
        //filterOptionsMenu={() => {}}
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
          <CustomTable
            fields={FeatureFields}
            data={featureTable ? featureTable?.data.slice(0, 7) : []}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default AddsOnFeatureRecord;
