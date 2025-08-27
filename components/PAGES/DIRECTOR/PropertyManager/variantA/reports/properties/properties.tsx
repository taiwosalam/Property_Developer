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
} from "@/app/(nav)/reports/properties/data";
import { useEffect, useState, useCallback } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "@/app/(nav)/reports/tenants/types";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import { AxiosRequestConfig } from "axios";
import { ReportsRequestParams } from "@/app/(nav)/reports/tenants/data";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "@/app/(nav)/reports/data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";

const PropertyDeveloperPropertiesReportVariantA = () => {
  const router = useRouter();
  const [pageData, setPageData] = useState<TransformedPropertyData>({
    total_properties: 0,
    monthly_properties: 0,
    properties: [],
  });
  const setPropertiesStore = useGlobalStore((s) => s.setGlobalInfoStore);

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
    if (apiData) setBranches(apiData.data);
    if (staff) {
      const filterStaff = staff.data.filter(
        (staff: any) => staff.staff_role === "account officer"
      );
      setBranchAccountOfficers(filterStaff);
    }
    if (property) setPropertyList(property.data);
  }, [apiData, staff, property]);

  // ...existing code...

  const reportTenantFilterOption = [
    {
      label: "Account Manager",
      value: [
        ...new Map(
          branchAccountOfficers.map((staff: any) => [
            staff.user.name.toLowerCase(), // Use lowercase for comparison
            {
              label: staff.user.name, // Keep original case for display
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
              label: branch.branch_name,
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
  ];

  // ...existing code...

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

  const { data, loading, error, isNetworkError } =
    useFetch<PropertyApiResponse>("/report/properties", config);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformPropertyData(data);
      const newProperties = transformedData.properties;
      const currentProperties = useGlobalStore.getState().properties;
      if (JSON.stringify(currentProperties) !== JSON.stringify(newProperties)) {
        setPageData(transformedData);
        setPropertiesStore("properties", newProperties);
      }
    }
  }, [data, loading, setPropertiesStore]);

  const { properties, monthly_properties, total_properties } = pageData;

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Properties Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

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
        xlsxData={useGlobalStore.getState().properties}
        fileLabel={"Properties Reports"}
      />
      <section>
        {pageData.properties.length === 0 && !loading ? (
          !!config.params.search || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Property Data Available Yet"
              body={
                <p>
                  Currently, there is no property data available for export.
                  Once data is added to the system, they will be displayed here
                  and ready for download or export.
                  <br />
                  <br />
                  <p>
                    This section will automatically update to show all available
                    property records as they are created or imported into the
                    platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={propertiesReportTablefields}
            data={pageData.properties || []}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default PropertyDeveloperPropertiesReportVariantA;
