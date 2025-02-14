"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
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

const TenantsReport = () => {
  const [tenant_reports, setTenant_reports] = useState<TenantReport>({
    total_tenants: 0,
    monthly_tenants: 0,
    tenants: [],
  })

  const {
    data,
    loading,
    error,
    isNetworkError
  } = useFetch<TenantListResponse>("/report/tenants");

  useEffect(() => {
    if (data) {
      setTenant_reports(transformTenantData(data));
    }
  }, [data]);

  const {
    total_tenants,
    monthly_tenants,
    tenants
  } = tenant_reports

  if (loading) return <CustomLoader layout="page" pageTitle="Tenants/Occupants" view="table" />
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
        <ManagementStatistcsCard
          title="Total Occupants"
          newData={monthly_tenants}
          total={total_tenants}
          colorScheme={2}
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
        handleFilterApply={() => { }}
        filterOptionsMenu={reportsTenantsFilterOptionsWithDropdown}
        hasGridListToggle={false}
        exportHref="/reports/tenants/export"
      />
      <CustomTable
        fields={tenantsReportTableFields}
        data={tenants}
        tableHeadClassName="h-[45px]"
        tableBodyCellSx={{ color: "#3F4247" }}
      />
    </div>
  );
};

export default TenantsReport;
