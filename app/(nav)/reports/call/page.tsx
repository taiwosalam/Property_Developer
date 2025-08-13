"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsCallsFilterOptionsWithDropdown,
  callRequestTablefields,
  CallRequestTableData,
  ICallbackRequestPageData,
  transformCallbackPageData,
} from "./data";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { useGlobalStore } from "@/store/general-store";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import { debounce } from "lodash";
import dayjs from "dayjs";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { hasActiveFilters } from "../data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";

const Call = () => {
  const [pageData, setPageData] = useState<ICallbackRequestPageData | null>(
    null
  );

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });

  const setCallbackStore = useGlobalStore((s) => s.setGlobalInfoStore);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);

  const { data: branchApi } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  useEffect(() => {
    if (apiData) setBranches(branchApi.data);
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
  }, [branchApi, staff, property]);

  const {
    data: apiData,
    loading,
    error,
    refetch,
    isNetworkError,
  } = useFetch<CallbackApiResponse>(`/report/call-request`, config);

  useEffect(() => {
    if (apiData) {
      const transformData = transformCallbackPageData(apiData);
      setPageData(transformData);
    }
  }, [apiData]);

  const reportTenantFilterOption = [
    {
      label: "Account Manager",
      value: [
        ...new Map(
          branchAccountOfficers.map((staff: any) => [
            staff.user.name.toLowerCase(), // Use lowercase for comparison
            {
              label: staff.user.name.toLowerCase(), // Keep original case for display
              value: staff.user.id.toString(),
            },
          ])
        ).values(),
      ],
    },
    {
      label: "Branch",
      value: [
        ...new Map(
          branches.map((branch) => [
            branch.branch_name.toLowerCase(),
            {
              label: branch.branch_name.toLowerCase(),
              value: branch.id.toString(),
            },
          ])
        ).values(),
      ],
    },
    {
      label: "Property",
      value: [
        ...new Map(
          propertyList
            .filter((u) => u.units.length > 0)
            .map((property: any) => [
              property.title.toLowerCase(), // Use lowercase for comparison
              {
                label: property.title.toLowerCase(), // Keep original case for display
                value: property.id.toString(),
              },
            ])
        ).values(),
      ],
    },
  ];

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Manager"] || [];
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
    if (!loading && apiData) {
      const transformedData = transformCallbackPageData(apiData);

      const newTenants = transformedData.callback_request;
      const currentTenants = useGlobalStore.getState().tenants;
      if (JSON.stringify(currentTenants) !== JSON.stringify(newTenants)) {
        setPageData(transformedData);
        setCallbackStore("callback_requests", newTenants);
      }
    }
  }, [apiData, loading, setCallbackStore]);

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Request Callback Report"
        view="table"
      />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Call Request"
          newData={pageData?.monthly_callback || 0}
          total={pageData?.total_callback || 0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Resolved"
          newData={pageData?.monthly_resolved || 0}
          total={pageData?.total_resolved || 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Unresolved"
          newData={pageData?.monthly_unresolved || 0}
          total={pageData?.total_resolved || 0}
          colorScheme={3}
        />
      </div>
      <FilterBar
        exports
        isDateTrue
        azFilter
        pageTitle="Calls Request"
        aboutPageModalData={{
          title: "calls request",
          description:
            "This page contains a list of calls request on the platform.",
        }}
        searchInputPlaceholder="Search for calls request"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        exportHref="/reports/call/export"
        hasGridListToggle={false}
        xlsxData={useGlobalStore.getState().callback_requests}
        fileLabel={"Request Callback Reports"}
      />

      <section>
        {pageData?.callback_request.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Request Callback Available Yet"
              body={
                <p>
                  There are currently no callback requests to export. This
                  section will automatically populate once tenants or occupants
                  submit callback requests through the platform. As soon as new
                  requests are received, they will appear here and be available
                  for review or follow-up.
                  <br />
                  <br />
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={callRequestTablefields}
            data={pageData?.callback_request || []}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default Call;
