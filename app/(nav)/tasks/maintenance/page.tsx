"use client";

// Imports
import Button from "@/components/Form/Button/button";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import MaintenanceCard from "@/components/tasks/maintenance/maintenance-card";
import { useCallback, useEffect, useState } from "react";
import {
  getALLMaintenance,
  IMaintenanceCard,
  maintenanceFilterOptionsWithDropdown,
  MaintenanceRequestParams,
  transformMaintenanceCard,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import CardsLoading from "@/components/Loader/CardsLoading";
import { MaintenanceApiResponse } from "./type";
import PageLoader from "next/dist/client/page-loader";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { AxiosRequestConfig } from "axios";
import { LandlordRequestParams } from "../../management/landlord/data";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "../../reports/data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import { debounce } from "lodash";

const Maintenance = () => {
  const [maintenanceData, setMaintenanceData] =
    useState<IMaintenanceCard | null>(null);

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as LandlordRequestParams,
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const {
    data: apiData,
    silentLoading,
    error,
    loading,
    isNetworkError,
    refetch,
  } = useFetch<MaintenanceApiResponse>(`maintenance`, config);

  useRefetchOnEvent("dispatchMaintenance", () => refetch({ silent: true }));

  const handleAppliedFilter = useCallback(
    debounce((filters: FilterResult) => {
      setAppliedFilters(filters);
      const { menuOptions, startDate, endDate } = filters;
      const accountOfficer = menuOptions["Account Officer"] || [];
      const status = menuOptions["Status"] || [];
      const property = menuOptions["Property"] || [];

      const queryParams: MaintenanceRequestParams = { page: 1, search: "" };
      if (accountOfficer.length > 0)
        queryParams.account_officer_id = accountOfficer.join(",");
      if (status.length > 0) queryParams.status = status.join(",");
      if (property.length > 0) queryParams.property_ids = property.join(",");
      if (startDate)
        queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
      if (endDate)
        queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
      setConfig({ params: queryParams });
    }, 300),
    []
  );

  const { data: propertyData } = useFetch<any>(`property/list`);

  const propertyOptions = propertyData?.data?.properties?.data?.map(
    (property: { id: number; title: string }) => ({
      value: property.id,
      label: property.title,
    })
  );

  const handlePageChange = (page: number) => {
    setConfig((prev) => ({
      params: { ...prev.params, page },
    }));
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort_order: order },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

  useEffect(() => {
    // getALLMaintenance;
    if (apiData) {
      const transformData = transformMaintenanceCard(apiData);
      setMaintenanceData(transformData);
    }
  }, [apiData]);

  if (loading) return <PageCircleLoader />;

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container">
        <div className="hidden md:flex gap-5 flex-wrap">
          <ManagementStatistcsCard
            title="Total Maintenance"
            newData={maintenanceData?.stats.this_month || 0}
            total={maintenanceData?.stats.total || 0}
            colorScheme={1}
          />
        </div>
        <div className="flex items-center">
          <Button
            href="/tasks/maintenance/create-new"
            className="page-header-button"
          >
            + create maintenance
          </Button>
        </div>
      </div>
      <FilterBar
        hasGridListToggle={false}
        azFilter
        pageTitle="Maintenance"
        aboutPageModalData={{
          title: "Maintenance",
          description:
            "This page contains a list of Maintenance on the platform.",
        }}
        searchInputPlaceholder="Search maintenance"
        handleFilterApply={handleAppliedFilter}
        handleSearch={handleSearch}
        onSort={handleSort}
        isDateTrue
        filterOptionsMenu={[
          ...maintenanceFilterOptionsWithDropdown,
          ...(propertyOptions?.length > 0
            ? [
                {
                  label: "Property",
                  value: propertyOptions,
                },
              ]
            : []),
        ]}
      />

      {loading || silentLoading ? (
        <AutoResizingGrid gap={28} minWidth={400}>
          <PropertyrequestSkeletonLoader length={10} />
        </AutoResizingGrid>
      ) : !maintenanceData?.data?.length ? (
        // Show empty state when no visitors exist
        <EmptyList
          noButton
          title="No Maintenance Records Available"
          body={
            <p>
              At the moment, there are no maintenance records linked to any
              properties. Once you create a maintenance record, the details will
              be displayed here. Maintenance helps keep everyone involved
              informed about upcoming repairs or renovations, including the
              expected start date and estimated completion time.
              <br />
            </p>
          }
        />
      ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
        // If we have data but search/filters return nothing, show search error
        maintenanceData?.data?.length === 0 ? (
          <SearchError />
        ) : (
          // Show filtered/searched results
          <section>
            <AutoResizingGrid gap={28} minWidth={380}>
              {maintenanceData?.data?.map((details, index) => (
                <MaintenanceCard
                  key={index}
                  card={details.card}
                  modal={details.modal}
                />
              ))}
            </AutoResizingGrid>
          </section>
        )
      ) : (
        // Show all results when no search/filters active
        <section>
          <AutoResizingGrid gap={32} minWidth={380}>
            {maintenanceData?.data.map((details, index) => (
              <MaintenanceCard
                key={index}
                card={details.card}
                modal={details.modal}
              />
            ))}
          </AutoResizingGrid>
        </section>
      )}
    </div>
  );
};

export default Maintenance;
