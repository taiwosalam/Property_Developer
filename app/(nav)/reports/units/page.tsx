"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsUnitsFilterOptionsWithDropdown,
  unitsReportTableFields,
} from "./data";
import useFetch from "@/hooks/useFetch";
import {
  transformUnitListData,
  UnitListResponse,
  Units,
  UnitsReportType,
} from "./types";
import { useEffect, useState } from "react";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import { FilterResult, BranchFilter, PropertyFilter } from "../tenants/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import dayjs from "dayjs";

const UnitsReport = () => {
  const [unitData, setUnitData] = useState<UnitsReportType>({
    total_unit: 0,
    monthly_unit: 0,
    units: [],
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
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as ReportsRequestParams,
  });

  const { data, loading, error, isNetworkError } = useFetch<UnitListResponse>(
    "/report/units",
    config
  );

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

  useEffect(() => {
    if (data) {
      setUnitData(transformUnitListData(data));
    }
  }, [data]);

  const { total_unit, monthly_unit, units } = unitData;

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
    return <CustomLoader layout="page" pageTitle="Units Report" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
          newData={monthly_unit}
          total={total_unit}
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
        handleSearch={handleSearch}
        onSort={handleSort}
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        filterOptionsMenu={reportTenantFilterOption}
        searchInputPlaceholder="Search for Units"
        hasGridListToggle={false}
        exportHref="/reports/units/export"
      />

      <section>
        {units.length === 0 && !loading ? (
          config.params.search || appliedFilters ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No Search/Filter Found
            </div>
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Reports are empty
            </div>
          )
        ) : (
          <CustomTable
            fields={unitsReportTableFields}
            data={units}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default UnitsReport;
