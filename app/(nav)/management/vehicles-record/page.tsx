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
import ServerError from "@/components/Error/ServerError";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const VehilceRecords = () => {
  const storedView = useView();
  const [pageData, setPageData] = useState<initialPageState>(() => {
    const savedPage = sessionStorage.getItem("vehicles_record_page");
    return {
      ...initialData,
      stats: {
        ...initialData.stats,
        current_page: savedPage ? parseInt(savedPage, 10) : 1,
      },
    };
  });
  const {
    properties_this_month,
    total_properties,
    total_vehicle_records,
    vehicle_records_this_month,
    current_page,
    last_page,
    property_type_stats,
  } = pageData.stats;

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("vehicles_record_page", current_page.toString());
  }, [current_page]);

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
      page: current_page,
      search: "",
      sort: "asc",
    } as VehicleRecordParams,
  });

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order, page: 1 },
    });
    setPageData((prevData) => ({
      ...prevData,
      stats: {
        ...prevData.stats,
        current_page: 1,
      },
    }));
    sessionStorage.setItem("vehicles_record_page", "1");
  };

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
    setPageData((prevData) => ({
      ...prevData,
      stats: {
        ...prevData.stats,
        current_page: page,
      },
    }));
    sessionStorage.setItem("vehicles_record_page", page.toString());
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query, page: 1 },
    });
    setPageData((prevData) => ({
      ...prevData,
      stats: {
        ...prevData.stats,
        current_page: 1,
      },
    }));
    sessionStorage.setItem("vehicles_record_page", "1");
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
        queryParams.all = "all";
      } else if (option === "rental") {
        queryParams.property_type = "rental";
      } else if (option === "facility") {
        queryParams.property_type = "facility";
      }
    });

    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }
    setConfig({
      params: queryParams,
    });
    setPageData((prevData) => ({
      ...prevData,
      stats: {
        ...prevData.stats,
        current_page: 1,
      },
    }));
    sessionStorage.setItem("vehicles_record_page", "1");
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

  // console.log("Page data", pageData)

  if (loading)
    return (
      <CustomLoader
        layout="page"
        pageTitle="Vehicle Records"
        statsCardCount={3}
      />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

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
            newData={property_type_stats.rental.this_month}
            total={property_type_stats.rental.total}
            colorScheme={2}
          />
          <ManagementStatistcsCard
            title="Facility Vehicle Records"
            newData={property_type_stats.facility.this_month}
            total={property_type_stats.facility.total}
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
            <SearchError />
          ) : (
            <EmptyList
              noButton
              title="You have not activate any vehicles record yet"
              body={
                <p>
                  When creating or editing property settings, you have the
                  option to enable vehicle records by selecting &quot;Yes.&quot;
                  This feature allows you to maintain and manage two distinct
                  types of vehicle records: rental vehicle records and facility
                  vehicle records. Each type serves a unique purpose to enhance
                  property management within gated communities or commercial
                  facilities.
                  <br />
                  <br />
                  <strong>Rental Vehicle Records</strong>
                  <br />
                  Rental vehicle records are designed specifically for
                  properties intended for rent within gated communities. These
                  records streamline the management processes for landlords,
                  occupants, tenants, and property managers. By organizing
                  vehicle information under this category, you can efficiently
                  oversee tenant-related vehicle details, ensuring smooth
                  operations and better communication between stakeholders.
                  <br />
                  <br />
                  <strong>Facility Vehicle Records</strong>
                  <br />
                  Facility vehicle records cater to the management of occupants
                  in gated estates or commercial facilities. This feature allows
                  property managers to oversee essential activities, including:
                  <ul className="custom-list">
                    <li>
                      Monitoring occupant vehicle movements (entry and exit).{" "}
                    </li>
                    <li>Managing visitor access to the premises.</li>
                    <li>
                      Keeping a comprehensive database of vehicles associated
                      with occupants.
                    </li>
                  </ul>
                  These records ensure seamless access control and help maintain
                  security standards within the estate or facility.
                  <br />
                  <br />
                  <strong> How This Works </strong>
                  <br />
                  <span>
                    Once a vehicle record is added to this page, the
                    introductory guide will automatically disappear, as the page
                    transitions into active management mode. However, if you
                    ever need assistance or wish to revisit this guide, Simply
                    click your profile picture at the top right of the dashboard
                    and select Assistance & Support.
                  </span>
                  <br />
                  <span>
                    By enabling vehicle records, you enhance the efficiency of
                    property management while ensuring a secure and organized
                    environment for all occupants and visitors.
                  </span>
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
                  <VehicleCard key={index} data={p} />
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
