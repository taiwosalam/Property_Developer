"use client";
import CustomTable from "@/components/Table/table";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { vehicleRecordReportTableFields } from "./data";
import {
  transformVehicleRecordsData,
  VehicleRecordsResponse,
  VehicleRecordsType,
} from "./types";
import { useCallback, useEffect, useState } from "react";
import useFetch from "@/hooks/useFetch";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import { BranchFilter, FilterResult, PropertyFilter } from "../tenants/types";
import { ReportsRequestParams } from "../tenants/data";
import { AxiosRequestConfig } from "axios";
import { BranchStaff } from "@/app/(nav)/(messages-reviews)/messages/types";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import ServerError from "@/components/Error/ServerError";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { usePersonalInfoStore } from "@/store/personal-info-store";

const VehiclesRecordReport = () => {
  const { branch } = usePersonalInfoStore();
  const BRANCH_ID = branch?.branch_id || 0;
  const router = useRouter();
  const [pageData, setPageData] = useState<VehicleRecordsType[]>([]);
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const filteredVehicleRecords = useGlobalStore((s) => s.vehicle_records);

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
  const fetchUrl =
    BRANCH_ID && BRANCH_ID !== 0
      ? `/report/vehicle-records?branch_id=${BRANCH_ID}`
      : null;

  const { data, loading, error, isNetworkError } =
    useFetch<VehicleRecordsResponse>(`/report/vehicle-records`, config);

  useEffect(() => {
    if (!loading && data) {
      const transformedData = transformVehicleRecordsData(data);
      const newVehicleRecords = transformedData;
      const currentVehicleRecords = useGlobalStore.getState().vehicle_records;
      if (
        JSON.stringify(currentVehicleRecords) !==
        JSON.stringify(newVehicleRecords)
      ) {
        setPageData(transformedData);
        setGlobalStore("vehicle_records", newVehicleRecords);
      }
    }
  }, [data, loading, setGlobalStore]);

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Vehicle Report" view="table" />
    );
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <FilterBar
        azFilter
        exports
        isDateTrue
        pageTitle="Vehicle Records"
        aboutPageModalData={{
          title: "Vehicle Records",
          description:
            "This page contains a list of vehicle records on the platform.",
        }}
        searchInputPlaceholder="Search for vehicle records"
        handleFilterApply={handleAppliedFilter}
        appliedFilters={appliedFilters}
        onSort={handleSort}
        handleSearch={handleSearch}
        filterOptionsMenu={reportTenantFilterOption}
        hasGridListToggle={false}
        exportHref="/reports/vehicles-record/export"
        xlsxData={useGlobalStore.getState().vehicle_records}
        fileLabel={"Vehicle Reports"}
      />
      <section>
        {pageData.length === 0 && !loading ? (
          !!config.params.search.trim() || hasActiveFilters(appliedFilters) ? (
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="No Vehicle Records Available Yet"
              body={
                <p>
                  At the moment, there are no vehicle records available for
                  export. Once vehicle data is added to the system, it will
                  appear here and be available for download or export.
                  <br />
                  <br />
                  <p>
                    This section will automatically populate with all available
                    vehicle records as soon as new entries are created or
                    imported into the platform.
                  </p>
                </p>
              }
            />
          )
        ) : (
          <CustomTable
            fields={vehicleRecordReportTableFields}
            data={pageData}
            tableHeadClassName="h-[45px]"
          />
        )}
      </section>
    </div>
  );
};

export default VehiclesRecordReport;
