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
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { AxiosRequestConfig } from "axios";
import EmptyList from "@/components/EmptyList/Empty-List";
import { BranchFilter, FilterResult, PropertyFilter } from "./types";
import dayjs from "dayjs";
import { Branch, BranchStaff } from "../../(messages-reviews)/messages/types";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const TenantsReport = () => {
  const [tenant_reports, setTenant_reports] = useState<TenantReport>({
    total_tenants: 0,
    monthly_tenants: 0,
    tenants: [],
  });
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
  const { data: apiData } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const { data: property } = useFetch<any>(`property/all`);

  useEffect(() => {
    if (apiData) {
      setBranches(apiData.data);
    }
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) {
      setPropertyList(property.data);
    }
  }, [apiData, staff, property]);

  const reportTenantFilterOption = [
    {
      label: "Account Officer",
      value: branchAccountOfficers.map((staff: any) => ({
        label: staff.user.name,
        value: staff.user.id.toString(),
      })),
    },
    {
      label: "Branch",
      value: branches.map((branch) => ({
        label: branch.branch_name,
        value: branch?.id.toString(),
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
    params: {
      page: 1,
      search: "",
    } as ReportsRequestParams,
  });

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleAppliedFilter = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate } = filters;
    const accountOfficer = menuOptions["Account Officer"] || [];
    const branch = menuOptions["Branch"] || [];
    const property = menuOptions["Property"] || [];

    const queryParams: ReportsRequestParams = {
      page: 1,
      search: "",
    };

    if (accountOfficer.length > 0) {
      queryParams.account_officer_id = accountOfficer.join(",");
    }
    if (branch.length > 0) {
      queryParams.branch_id = branch.join(",");
    }
    if (property.length > 0) {
      queryParams.property_id = property.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
    }
    setConfig({
      params: queryParams,
    });
  };

  const { data, loading, error, isNetworkError } = useFetch<TenantListResponse>(
    "/report/tenants",
    config
  );

  useEffect(() => {
    if (data) {
      setTenant_reports(transformTenantData(data));
    }
  }, [data]);

  const { total_tenants, monthly_tenants, tenants } = tenant_reports;

  const hasActiveFilters = (filters: any) => {
    return (
      (filters.options && filters.options.length > 0) ||
      (filters.menuOptions && Object.keys(filters.menuOptions).length > 0) ||
      filters.startDate ||
      filters.endDate
    );
  };

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Tenants"
          newData={monthly_tenants}
          total={total_tenants}
          colorScheme={1}
        />
        {/* <ManagementStatistcsCard
          title="Total Occupants"
          newData={total_tenants}
          total={monthly_tenants}
          colorScheme={2}
        /> */}
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
        handleSearch={handleSearch}
        onSort={handleSort}
        searchInputPlaceholder="Search for Tenants/Occupants"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/tenants/export"
      />
      <section>
        {tenants.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-left py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Tenant or Occupant Profiles Available Yet"
                body={
                  <p className="">
                    At the moment, there are no tenant/occupant profiles
                    available for export. Once profile records are added to the
                    system, they will appear here and be available for download
                    or export. <br /> <br />
                    <p>
                      This section will automatically populate with all
                      available data as soon as new tenant or occupant profiles
                      are created or imported into the platform.
                    </p>
                  </p>
                }
              />
            </div>
          )
        ) : (
          <CustomTable
            fields={tenantsReportTableFields}
            data={tenants}
            tableHeadClassName="h-[45px]"
            tableBodyCellSx={{ color: "#3F4247" }}
          />
        )}
      </section>
    </div>
  );
};

export default TenantsReport;
