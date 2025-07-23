"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  ReportsRequestParams,
  reportsTenantsFilterOptionsWithDropdown,
  TenantListResponse,
  TenantReport,
  tenantsReportTableFields,
  transformTenantData,
} from "./data";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { AxiosRequestConfig } from "axios";
import { BranchFilter, FilterResult, PropertyFilter } from "./types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const TenantsReport = () => {
  const router = useRouter();
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const [pageData, setPageData] = useState<TenantReport>({
    total_tenants: 0,
    monthly_tenants: 0,
    tenants: [],
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);

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

  const reportTenantFilterOption = [
    {
      label: "Account Officer",
      value: branchAccountOfficers.map((staff: any) => ({
        label: staff.user.name,
        value: staff.user.id.toString(),
      })),
    },
    {
      label: "Property",
      value: propertyList.map((property: any) => ({
        label: property.title,
        value: property.id.toString(),
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
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const property = menuOptions["Property"] || [];

      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  // Conditionally set the URL only if BRANCH_ID is valid
  const fetchUrl = BRANCH_ID && BRANCH_ID !== 0 ? `/report/tenants` : null;
  // FETCH
  const { data, loading, error, isNetworkError } = useFetch<TenantListResponse>(
    `/report/tenants`,
    config
  );

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformTenantData(data);
      const newTenants = transformedData.tenants;
      const currentTenants = useGlobalStore.getState().tenants;
      if (JSON.stringify(currentTenants) !== JSON.stringify(newTenants)) {
        setPageData(transformedData);
        setGlobalStore("tenants", newTenants);
      }
    }
  }, [data, loading, setGlobalStore]);

  // Render an error message if BRANCH_ID is invalid
  // if (!BRANCH_ID || BRANCH_ID === 0) {
  //   return (
  //     <div className="text-base text-red-500 font-medium">
  //       Invalid branch ID. Please select a valid branch.
  //     </div>
  //   );
  // }

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Tenants"
          newData={pageData.monthly_tenants}
          total={pageData.total_tenants}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Tenants/Occupants"
        aboutPageModalData={{
          title: "Tenants/Occupants",
          description:
            "This page contains a list of Tenants/Occupants on the platform.",
        }}
        searchInputPlaceholder="Search for Tenants/Occupants"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/tenants/export"
        xlsxData={useGlobalStore.getState().properties}
        fileLabel={"Tenants Reports"}
      />
      <section>
        {pageData.tenants.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Tenant or Occupant Profiles Available Yet"
              body={
                <p>
                  At the moment, there are no tenant/occupant profiles available
                  for export. Once profile records are added to the system, they
                  will appear here and be available for download or export.
                  <br />
                  <br />
                  <p>
                    This section will automatically populate with all available
                    data as soon as new tenant or occupant profiles are created
                    or imported into the platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={tenantsReportTableFields}
            data={pageData.tenants}
            tableHeadClassName="h-[45px]"
            tableBodyCellSx={{ color: "#3F4247" }}
          />
        )}
      </section>
    </div>
  );
};

export default TenantsReport;
