"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  reportsLandlordsFilterOptionsWithDropdown,
  landlordsReportTableFields,
  landlordsReportTableData,
   type LandlordsReport,
  LandlordsApiResponse,
  transformLandlordsData,
} from "./data";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { BranchStaff } from "../../(messages-reviews)/messages/types";
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

const LandlordsReport = () => {
  const router = useRouter();
  const [pageData, setPageData] = useState<LandlordsReport>({
    total_landlords: 0,
    monthly_landlords: 0,
    landlords: [],
  });
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredLandlords = useGlobalStore((s) => s.landlords);

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
  const { data: property } = useFetch<any>(`property/all`);

  useEffect(() => {
    console.log("Source page - filteredLandlords:", filteredLandlords);
  }, [filteredLandlords]);

  useEffect(() => {
    if (apiData) setBranches(apiData.data);
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
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
      const branch = menuOptions["Branch"] || [];
      const property = menuOptions["Property"] || [];

      const queryParams: ReportsRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0) queryParams.account_officer_id = accountOfficer.join(",");
      if (branch.length > 0) queryParams.branch_id = branch.join(",");
      if (property.length > 0) queryParams.property_id = property.join(",");
      if (startDate) queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate) queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  const { data, loading, error, isNetworkError } = useFetch<LandlordsApiResponse>(
    "/report/landlords",
    config
  );

  useEffect(() => {
    console.log("Fetch config:", config);
  }, [config]);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformLandlordsData(data);
      console.log("API data:", data);
      console.log("Transformed data:", transformedData);
      const newLandlords = transformedData.landlords;
      const currentLandlords = useGlobalStore.getState().landlords;
      if (JSON.stringify(currentLandlords) !== JSON.stringify(newLandlords)) {
        setPageData(transformedData);
        setGlobalStore("landlords", newLandlords);
        console.log("Store after update:", useGlobalStore.getState().landlords);
      }
    }
    if (error) console.error("Fetch error:", error);
    if (isNetworkError) console.error("Network error");
  }, [data, loading, setGlobalStore]);

  const handleExport = () => {
    if (!data || loading) return;
    setGlobalStore("landlords", pageData.landlords);
    router.push("/reports/landlords/export");
  };

  if (loading) return <CustomLoader layout="page" pageTitle="Landlord/Landlady" view="table" />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total"
          newData={pageData.monthly_landlords}
          total={pageData.total_landlords}
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Landlord/Landlady"
        aboutPageModalData={{
          title: "Landlord/Landlady",
          description: "This page contains a list of Landlord/Landlady on the platform.",
        }}
        searchInputPlaceholder="Search for Landlord/Landlady"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/landlord/export"
        xlsxData={useGlobalStore.getState().landlords}
        fileLabel={"Landlord & Landlady Reports"}
      />
      <section>
        {pageData.landlords.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Landlord or Landlady Profiles Available Yet"
              body={
                <p>
                  At the moment, there are no landlord or landlady profiles available for export.
                  Once profile records are added to the system, they will appear here and be available for download or export.
                  <br /><br />
                  <p>
                    This section will automatically populate with all available data as soon as new landlord or landlady profiles are created or imported into the platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={landlordsReportTableFields}
            data={pageData.landlords}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default LandlordsReport;