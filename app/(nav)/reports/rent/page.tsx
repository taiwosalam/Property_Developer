"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsRentFilterOptionsWithDropdown,
  rentReportTableFields,
  transformRentData,
} from "./data";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import { useState, useEffect } from "react";
import { ReportsRequestParams } from "../tenants/data";
import { RentListResponse, RentReportData } from "./types";
import NetworkError from "@/components/Error/NetworkError";
import CustomLoader from "@/components/Loader/CustomLoader";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import dayjs from "dayjs";
import { hasActiveFilters } from "../data/utils";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import EmptyList from "@/components/EmptyList/Empty-List";

export interface RentRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  account_officer_id?: string;
  start_date?: string;
  end_date?: string;
  property_id?: string;
  branch_id?: string;
}

const RentReport = () => {
  const [rentPageData, setRentPageData] = useState<RentReportData>({
    total_rents: 0,
    current_month_rents: 0,
    rents: [],
  });
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as RentRequestParams,
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

  const { data, loading, error, isNetworkError } = useFetch<RentListResponse>(
    "report/rents",
    config
  );

  useEffect(() => {
    if (data) {
      setRentPageData(transformRentData(data));
    }
  }, [data]);

  const { rents, total_rents, current_month_rents } = rentPageData;

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

  if (loading)
    return <CustomLoader layout="page" pageTitle="Rent Report" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Rent / Due"
          newData={rentPageData.current_month_rents}
          total={rentPageData.total_rents}
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
        handleSearch={handleSearch}
        onSort={handleSort}
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        filterOptionsMenu={reportTenantFilterOption}
        searchInputPlaceholder="Search for Rent Roll"
        hasGridListToggle={false}
        exportHref="/reports/rent/export"
      />

      <section>
        {rents.length === 0 && !loading ? (
          config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-left py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Rent Report Data Available Yet
"
                body={
                  <p className="">
                    Currently, there are no rent report records available for
                    export. Once rent report data is added to the system, it
                    will appear here and be available for download or export.{" "}
                    <br /> <br />
                    <p>
                      This section will automatically update to display all
                      available rent reports as soon as they are generated or
                      imported into the platform.
                    </p>
                  </p>
                }
              />
            </div>
          )
        ) : (
          <CustomTable
            fields={rentReportTableFields}
            data={rents}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default RentReport;
