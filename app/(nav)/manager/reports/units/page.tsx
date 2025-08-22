"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsUnitsFilterOptionsWithDropdown,
  unitsReportTableFields,
} from "./data";
import {
  transformUnitListData,
  UnitListResponse,
  Units,
  UnitsReportType,
} from "./types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import { FilterResult, BranchFilter, PropertyFilter } from "../tenants/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const UnitsReport = () => {
  const router = useRouter();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;

  const [pageData, setPageData] = useState<UnitsReportType>({
    total_unit: 0,
    monthly_unit: 0,
    units: [],
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredUnits = useGlobalStore((s) => s.units);

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<
    BranchStaff[]
  >([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);


  useEffect(() => {
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
  }, [staff, property]);

  const unitStatus = ["occupied", "relocate", "vacant", "expired"];
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
      label: "Property",
      value: [
        ...new Map(
          propertyList.map((property: any) => [
            property.title.toLowerCase(), // Use lowercase for comparison
            {
              label: property.title, // Keep original case for display
              value: property.id.toString(),
            },
          ])
        ).values(),
      ],
    },
    {
      label: "Status",
      value: unitStatus.map((status) => ({
        label: status,
        value: status,
      })),
    },
  ];

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: { page: 1, search: "" } as ReportsRequestParams,
  });

  const handleSearch = (query: string) => {
    setConfig({ params: { ...config.params, search: query } });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({ params: { ...config.params, sort_order: order } });
  };

  const handleAppliedFilter = useCallback(
    (filters: FilterResult) => {
      const debouncedFilter = debounce((filters: FilterResult) => {
        setAppliedFilters(filters);
        const { menuOptions, startDate, endDate } = filters;
        const accountOfficer = menuOptions["Account Officer"] || [];
        const property = menuOptions["Property"] || [];
        const status = menuOptions["Status"] || [];

        const queryParams: ReportsRequestParams = { page: 1, search: "" };
        if (accountOfficer.length > 0)
          queryParams.account_officer_id = accountOfficer.join(",");
        if (property.length > 0) queryParams.property_id = property.join(",");
        if (status.length > 0) queryParams.status = status.join(",");
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

  const { data, loading, error, isNetworkError } = useFetch<UnitListResponse>(
    `/report/units`,
    config
  );

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformUnitListData(data);
      const newUnits = transformedData.units;
      const currentUnits = useGlobalStore.getState().units;
      if (JSON.stringify(currentUnits) !== JSON.stringify(newUnits)) {
        setPageData(transformedData);
        setGlobalStore("units", newUnits);
      }
    }
  }, [data, loading, setGlobalStore]);

  const handleExport = () => {
    if (!data || loading) return;
    setGlobalStore("units", pageData.units);
    router.push("/reports/units/export");
  };

  if (loading)
    return <CustomLoader layout="page" pageTitle="Units Report" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
          newData={pageData.monthly_unit}
          total={pageData.total_unit}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Units"
        aboutPageModalData={{
          title: "Units",
          description: "This page contains a list of Units on the platform.",
        }}
        searchInputPlaceholder="Search for Units"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/units/export"
        xlsxData={useGlobalStore.getState().units}
        fileLabel={"Unit Reports"}
      />
      <section>
        {pageData.units.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Unit Data Available Yet"
              body={
                <p>
                  There is currently no unit data available for export. Once
                  unit records are added to the system, they will automatically
                  appear here and be available for download or export.
                  <br />
                  <br />
                  <p>
                    This section will be updated in real-time as new unit
                    profiles are created, allowing you to easily manage and
                    export your data when needed.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={unitsReportTableFields}
            data={pageData.units}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default UnitsReport;
