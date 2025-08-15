"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsRentFilterOptionsWithDropdown,
  rentReportTableFields,
  transformRentData,
} from "./data";
import { RentListResponse, RentReportData } from "./types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const RentReport = () => {
  const router = useRouter();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;

  const [pageData, setPageData] = useState<RentReportData>({
    total_rents: 0,
    current_month_rents: 0,
    rents: [],
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredRents = useGlobalStore((s) => s.rents);

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

  const filterStatus = ["expired", "active", "relocate", "vacant"];
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
    {
      label: "Status",
      value: filterStatus.map((status) => ({
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

  // const handleAppliedFilter = useCallback(
  //   debounce((filters: FilterResult) => {
  //     setAppliedFilters(filters);
  //     const { menuOptions, startDate, endDate } = filters;
  //     const accountOfficer = menuOptions["Account Officer"] || [];
  //     const branch = menuOptions["Branch"] || [];
  //     const property = menuOptions["Property"] || [];
  //     const status = menuOptions["Status"] || [];

  //     const queryParams: ReportsRequestParams = { page: 1, search: "" };
  //     if (accountOfficer.length > 0)
  //       queryParams.account_officer_id = accountOfficer.join(",");
  //     if (branch.length > 0) queryParams.branch_id = branch.join(",");
  //     if (property.length > 0) queryParams.property_id = property.join(",");
  //     if (status.length > 0) queryParams.status = status.join(",");
  //     if (startDate)
  //       queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
  //     if (endDate)
  //       queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
  //     setConfig({ params: queryParams });
  //   }, 300),
  //   []
  // );

  // Conditionally set the URL only if BRANCH_ID is valid

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

  const { data, loading, error, isNetworkError } = useFetch<RentListResponse>(
    `/report/rents`,
    config
  );

  // useEffect(() => {
  //   if (!loading && data) {
  //     const transformedData = transformRentData(data);
  //     console.log("API data:", data);
  //     console.log("Transformed data:", transformedData);
  //     const newRents = transformedData.rents;
  //     const currentRents = useGlobalStore.getState().rents;
  //     if (JSON.stringify(currentRents) !== JSON.stringify(newRents)) {
  //       setPageData(transformedData);
  //       setGlobalStore("rents", newRents);
  //     }
  //   }
  //   if (error) console.error("Fetch error:", error);
  //   if (isNetworkError) console.error("Network error");
  // }, [data, loading, setGlobalStore]);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformRentData(data);
      const newRents = transformedData.rents;
      const currentRents = useGlobalStore.getState().rents;
      if (JSON.stringify(currentRents) !== JSON.stringify(newRents)) {
        setPageData(transformedData);
        setGlobalStore("rents", newRents);
      }
    }
  }, [data, loading, setGlobalStore]);



  if (loading)
    return <CustomLoader layout="page" pageTitle="Rent Report" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Rent / Due"
          newData={pageData.current_month_rents}
          total={pageData.total_rents}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Rent / Due Roll"
        aboutPageModalData={{
          title: "Rent / Due Roll",
          description:
            "This page contains a list of Rent / Due Roll on the platform.",
        }}
        searchInputPlaceholder="Search for Rent Roll"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/rent/export"
        xlsxData={useGlobalStore.getState().rents}
        fileLabel={"Rent Reports"}
      />
      <section>
        {pageData.rents.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Rent Report Data Available Yet"
              body={
                <p>
                  Currently, there are no rent report records available for
                  export. Once rent report data is added to the system, it will
                  appear here and be available for download or export.
                  <br />
                  <br />
                  <p>
                    This section will automatically update to display all
                    available rent reports as soon as they are generated or
                    imported into the platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={rentReportTableFields}
            data={pageData.rents}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default RentReport;
