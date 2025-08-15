"use client";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ExclamationMark } from "@/public/icons/icons";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import CustomLoader from "@/components/Loader/CustomLoader";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import FilterBar from "@/components/FIlterBar/FilterBar";
import CardsLoading from "@/components/Loader/CardsLoading";
import useView from "@/hooks/useView";
import useFetch from "@/hooks/useFetch";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { FilterResult } from "@/components/Management/Landlord/types";
import VehicleCard from "@/components/Management/Properties/vehicle-card";
import {
  initialPageState,
  VehicleRecordAPIRes,
  VehicleRecordParams,
} from "./type";
import {
  initialData,
  transformVehicleRecords,
  vehicleRecordFIltersOptionsWithDropdown,
} from "./data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

const VehilceRecords = () => {
  const storedView = useView();
  const [pageData, setPageData] = useState<initialPageState>(initialData);

  const {
    properties_this_month,
    total_properties,
    total_vehicle_records,
    vehicle_records_this_month,
    current_page,
    last_page,
  } = pageData.stats;

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
      sort: "asc",
    } as VehicleRecordParams,
  });

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order },
    });
  };

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
  };

  const handleSearch = async (query: string) => {
    // console.log("searching...")
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate, options } = filters;
    const statesArray = menuOptions["State"] || [];

    const queryParams: VehicleRecordParams = {
      page: 1,
      sort: "asc",
      search: "",
    };
    options.forEach((option) => {
      if (option === "all") {
        queryParams.all = "true";
      } else if (option === "trending") {
        queryParams.trending = true;
      } else if (option === "new") {
        queryParams.recent = true;
      }
    });

    if (statesArray.length > 0) {
      queryParams.state = statesArray.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }
    setConfig({
      params: queryParams,
    });

    console.log({ menuOptions, startDate, endDate, options });
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<VehicleRecordAPIRes>("/vehicle-records", config);

  useRefetchOnEvent("refetchThreads", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setPageData((x: any) => ({
        ...x,
        ...transformVehicleRecords(apiData),
      }));
    }
  }, [apiData]);

  console.log("Page data", pageData);

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Vehicle Records"
        statsCardCount={3}
      />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="page-header-container mt-4 md:mt-0">
        <div className="flex overflow-x-auto md:overflow-hidden gap-3 no-scrollbar flex-nowrap md:flex-wrap w-full px-2">
          <ManagementStatistcsCard
            title="Total Vehicle Records"
            newData={properties_this_month}
            total={total_properties}
            colorScheme={1}
          />
          <ManagementStatistcsCard
            title="Rental Vehicle Records"
            newData={vehicle_records_this_month}
            total={total_vehicle_records}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Facility Vehicle Records"
            newData={vehicle_records_this_month}
            total={total_vehicle_records}
            colorScheme={3}
          />
        </div>
      </div>

      {/* Page Title with search */}
      <FilterBar
        pageTitle="vehicles record"
        hasGridListToggle={false}
        aboutPageModalData={{
          title: "vehicles record",
          description:
            "This page contains a list of vehicles record on the platform.",
        }}
        searchInputPlaceholder="Search for vehicles record"
        filterOptions={{
          radio: true,
          value: [
            { label: "All", value: "all" },
            { label: "Rental", value: "rental" },
            { label: "Facility", value: "facility" },
          ],
        }}
        handleFilterApply={handleFilterApply}
        onSort={handleSort}
        handleSearch={handleSearch}
        appliedFilters={appliedFilters}
      />

      <section className="capitalize">
        {pageData.data.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No Search/Filter Found
            </div>
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
          <>
            <AutoResizingGrid minWidth={284}>
              {silentLoading ? (
                <CardsLoading />
              ) : (
                pageData.data.map((p, index) => (
                  <VehicleCard key={index} data={p} page="manager" />
                ))
              )}
            </AutoResizingGrid>

            <Pagination
              totalPages={last_page}
              currentPage={current_page}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </section>
    </div>
  );
};

export default VehilceRecords;
