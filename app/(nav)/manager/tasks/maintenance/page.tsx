"use client";

// Imports
import Button from "@/components/Form/Button/button";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import MaintenanceCard from "@/components/tasks/maintenance/maintenance-card";
import { useCallback, useEffect, useState } from "react";
import {
  IMaintenanceCard,
  maintenanceFilterOptionsWithDropdown,
  MaintenanceRequestParams,
  transformMaintenanceCard,
} from "@/app/(nav)/tasks/maintenance/data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import useFetch from "@/hooks/useFetch";
import ServerError from "@/components/Error/ServerError";
import NetworkError from "@/components/Error/NetworkError";
import CardsLoading from "@/components/Loader/CardsLoading";
import { MaintenanceApiResponse } from "@/app/(nav)/tasks/maintenance/type";
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
import CustomLoader from "@/components/Loader/CustomLoader";
import Pagination from "@/components/Pagination/pagination";
import { IPropertyApi } from "@/app/(nav)/settings/others/types";
import Link from "next/link";
import { PlusIcon } from "@/public/icons/icons";

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

  // const handleAppliedFilter = useCallback(
  //   debounce((filters: FilterResult) => {
  //     setAppliedFilters(filters);
  //     const { menuOptions, startDate, endDate } = filters;
  //     const accountOfficer = menuOptions["Account Officer"] || [];
  //     const status = menuOptions["Status"] || [];
  //     const property = menuOptions["Property"] || [];

  //     const queryParams: MaintenanceRequestParams = { page: 1, search: "" };
  //     if (accountOfficer.length > 0)
  //       queryParams.account_officer_id = accountOfficer.join(",");
  //     if (status.length > 0) queryParams.status = status.join(",");
  //     if (property.length > 0) queryParams.property_ids = property.join(",");
  //     if (startDate)
  //       queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD:hh:mm:ss");
  //     if (endDate)
  //       queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
  //     setConfig({ params: queryParams });
  //   }, 300),
  //   []
  // );

  const handleAppliedFilter = useCallback(
    (filters: FilterResult) => {
      const debouncedFilter = debounce((filters: FilterResult) => {
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
          queryParams.start_date = dayjs(startDate).format(
            "YYYY-MM-DD:hh:mm:ss"
          );
        if (endDate)
          queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD:hh:mm:ss");
        setConfig({ params: queryParams });
      }, 300);

      debouncedFilter(filters);
    },
    [setAppliedFilters, setConfig]
  );

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

  const propertyOptions =
    propertiesData?.data.properties.data
      // Filter for unique property titles
      .filter(
        (property, index, self) =>
          self.findIndex((p) => p.title === property.title) === index
      )
      .map((property) => ({
        label: property.title,
        value: property.id.toString(),
      })) || [];

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

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Maintenance" statsCardCount={3} />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container !justify-between">
        <div className="flex gap-5 pt-3 overflow-x-auto scrollbar-hide flex-nowrap md:flex-wrap">
          <ManagementStatistcsCard
            title="Total Maintenance"
            newData={maintenanceData?.stats.this_month || 0}
            total={maintenanceData?.stats.total || 0}
            colorScheme={1}
          />
        </div>
        <div className="hidden md:flex items-center">
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

      <section>
        {loading || silentLoading ? (
          <AutoResizingGrid gap={32} minWidth={380}>
            <CardsLoading length={10} />
          </AutoResizingGrid>
        ) : !maintenanceData?.data?.length ? (
          <EmptyList
            noButton
            title="No Maintenance Records Available"
            body={
              <p>
                At the moment, there are no maintenance records linked to any
                properties. Once you create a maintenance record, the details
                will be displayed here. Maintenance helps keep everyone involved
                informed about upcoming repairs or renovations, including the
                expected start date and estimated completion time.
                <br />
                <br />
                This message will automatically disappear once maintenance
                records are added.
                <br />
                <br />
                Need assistance? Click your profile icon in the top right corner
                and select &apos;Assistance & Support&apos; for help on using
                this page.
              </p>
            }
          />
        ) : !!config.params.search || hasActiveFilters(appliedFilters) ? (
          maintenanceData?.data?.length === 0 ? (
            <SearchError />
          ) : (
            <AutoResizingGrid gap={32} minWidth={380}>
              {maintenanceData?.data?.map((details, index) => (
                <MaintenanceCard
                  key={index}
                  card={details.card}
                  modal={details.modal}
                />
              ))}
            </AutoResizingGrid>
          )
        ) : (
          <AutoResizingGrid gap={32} minWidth={380}>
            {maintenanceData?.data.map((details, index) => (
              <MaintenanceCard
                key={index}
                card={details.card}
                modal={details.modal}
              />
            ))}
          </AutoResizingGrid>
        )}
      </section>

      <Link
        href="/tasks/maintenance/create-new"
        className="text-5xl md:hidden !rounded-full bg-brand-9 text-white grid place-items-center !size-[4rem] fixed bottom-4 right-4"
      >
        <PlusIcon />
      </Link>

      <div>
        <Pagination
          className="pb-4"
          onPageChange={handlePageChange}
          totalPages={maintenanceData?.pagination?.total_pages || 0}
          currentPage={maintenanceData?.pagination?.current_page || 0}
        />
      </div>
    </div>
  );
};

export default Maintenance;
