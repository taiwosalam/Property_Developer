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
import { initialPageState, VehicleRecordAPIRes, VehicleRecordParams } from "./type";
import { initialData, transformVehicleRecords, vehicleRecordFIltersOptionsWithDropdown } from "./data";
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
    last_page
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
    options.forEach(option => {
      if (option === 'all') {
        queryParams.all = true;
      } else if (option === 'trending') {
        queryParams.trending = true;
      } else if (option === 'new') {
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

    console.log({ menuOptions, startDate, endDate, options })
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

  console.log("Page data", pageData)


  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Vehicle Records" statsCardCount={3} />
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Properties"
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
        filterOptionsMenu={vehicleRecordFIltersOptionsWithDropdown}
        handleFilterApply={handleFilterApply}
        isDateTrue
        onSort={handleSort}
        handleSearch={handleSearch}
        appliedFilters={appliedFilters}
      />

      <section className="capitalize">
        {pageData.data.length === 0 && !silentLoading ? (
          isFilterApplied() ? (
            "No Search/Filter Found"
          ) : (
            <EmptyList
              noButton
              title="You have not activate any vehicles record yet"
              body={
                <p>
                  When creating or editing property settings, you have the option to enable vehicle records by selecting &quot;Yes.&quot; This feature allows you to maintain and manage two distinct types of vehicle records: rental vehicle records and facility vehicle records. Each type serves a unique purpose to enhance property management within gated communities or commercial facilities.

                  <br />
                  <br />

                  <strong>Rental Vehicle Records</strong>
                  <br />
                  Rental vehicle records are designed specifically for properties intended for rent within gated communities. These records streamline the management processes for landlords, occupants, tenants, and property managers. By organizing vehicle information under this category, you can efficiently oversee tenant-related vehicle details, ensuring smooth operations and better communication between stakeholders.
                  <br />
                  <br />

                  <strong>Facility Vehicle Records</strong>
                  <br />
                  Facility vehicle records cater to the management of occupants in gated estates or commercial facilities. This feature allows property managers to oversee essential activities, including:
                  <ul  className="custom-list">
                    <li>Monitoring occupant vehicle movements (entry and exit). </li>
                    <li>Managing visitor access to the premises.</li>
                    <li>Keeping a comprehensive database of vehicles associated with occupants.</li>
                  </ul>
                  These records ensure seamless access control and help maintain security standards within the estate or facility.
                  <br />
                  <br />

                  <strong> How This Works </strong>
                  <br />
                  <span>Once a vehicle record is added to this page, the introductory guide will automatically disappear, as the page transitions into active management mode. However, if you ever need assistance or wish to revisit this guide, you can easily do so. Simply click on the help icon <span className="inline-block text-brand-10 align-text-top">
                    <ExclamationMark />
                  </span>{" "} located at the top-left corner of the dashboard. This icon provides quick access to detailed instructions and support whenever needed.</span>
                  <br />
                  <span>By enabling vehicle records, you enhance the efficiency of property management while ensuring a secure and organized environment for all occupants and visitors.</span>
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
                pageData.data.map((p, index) => <VehicleCard key={index} data={p} total={total_vehicle_records} />)
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
