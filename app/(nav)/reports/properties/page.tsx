"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsPropertiessFilterOptions,
  propertiesReportTablefields,
  TransformedPropertyData,
  PropertyApiResponse,
  transformPropertyData,
} from "./data";
import { useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "../tenants/data";
import dayjs from "dayjs";

const PropertiesReport = () => {
  const [pageData, setPageData] = useState<TransformedPropertyData>({
    total_properties: 0,
    monthly_properties: 0,
    properties: [],
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });
  const [branches, setBranches] = useState<BranchFilter[]>([]);
  const [branchAccountOfficers, setBranchAccountOfficers] = useState<BranchStaff[]>([]);
  const [propertyList, setPropertyList] = useState<PropertyFilter[]>([]);
  const { data: apiData } = useFetch<any>("branches");
  const { data: staff } = useFetch<any>(`report/staffs`);
  const {data: property } = useFetch<any>(`property/all`);

  useEffect(() => {
    if (apiData) {
      setBranches(apiData.data);
    }
    if(staff){
      const filterStaff = staff.data.filter((staff: any) => staff.staff_role === "account officer")
      setBranchAccountOfficers(filterStaff)
    }
    if(property){
      setPropertyList(property.data)
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
    
  

  const { data, loading, error, isNetworkError } = useFetch<PropertyApiResponse>("/report/properties", config);

  useEffect(() => {
    if (data) {
      const transformedData = transformPropertyData(data);
      setPageData(transformedData);
    }
  }, [data]);

  const {
    total_properties,
    monthly_properties,
    properties,
  } = pageData

  if (loading) return <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
  if (isNetworkError) return <NetworkError />;
  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={monthly_properties}
          total={total_properties}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Properties Report"
        aboutPageModalData={{
          title: "Properties Report",
          description:
            "This page contains a list of Properties Report on the platform.",
        }}
        searchInputPlaceholder="Search for Properties Report"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/properties/export"
      />
      <CustomTable
        fields={propertiesReportTablefields}
        data={properties}
        tableHeadClassName="h-[45px]"
      />
    </div>
  );
};

export default PropertiesReport;
