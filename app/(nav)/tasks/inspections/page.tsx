"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import InspectionCard from "@/components/tasks/Inspections/inspection-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  FilterResult,
  inspectionFilterOptionsWithDropdown,
  InspectionRequestParams,
  transformInspectionCard,
} from "./data";
import useFetch from "@/hooks/useFetch";
import { InspectionDataApiResponse, InspectionPageType } from "./type";
import { useEffect, useRef, useState } from "react";
import NetworkError from "@/components/Error/NetworkError";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import CustomLoader from "@/components/Loader/CustomLoader";
import EmptyList from "@/components/EmptyList/Empty-List";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";

const InspectionPage = () => {
  const [inspectionData, setInspectionData] =
    useState<InspectionPageType | null>(null);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as InspectionRequestParams,
  });
  const [appliedFilter, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const eleScrollIn = useRef<HTMLDivElement | null>(null);

  const isFilteredApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilter;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const handleFilterApply = (filter: FilterResult) => {
    setAppliedFilters(filter);
    const { menuOptions, startDate, endDate } = filter;

    const queryParams: InspectionRequestParams = {
      page: 1,
      search: "",
    };
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD");
    }

    setConfig({
      params: queryParams,
    });
  };

  const handlePageChanger = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
    eleScrollIn.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order },
    });
  };

  const handleSearch = (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };
  const {
    data: apiData,
    isNetworkError,
    loading,
    silentLoading,
  } = useFetch<InspectionDataApiResponse>(`inspections`, config);

  useEffect(() => {
    if (apiData) {
      const transformData = transformInspectionCard(apiData);
      setInspectionData(transformData);
    }
  }, [apiData]);

  const propertyFilterOptionMenu = [
    {
      label: "Property",
      value:
        inspectionData?.card
          .map((item) => {
            return item?.property_name
              ? { label: item.property_name, value: item.property_name }
              : null;
          })
          .filter(
            (item): item is { label: string; value: string } => item !== null
          ) || [],
    },
  ];

  if (isNetworkError) {
    return <NetworkError />;
  }
  if (loading) {
    return <CustomLoader layout="page" pageTitle="Inspection" />;
  }

  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Inspections"
          newData={inspectionData?.total_inspections ?? 0}
          total={inspectionData?.total_months ?? 0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Physical Inspections"
          newData={inspectionData?.total_physical ?? 0}
          total={inspectionData?.total_physical_month ?? 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Virtual Inspections"
          newData={inspectionData?.total_virtual ?? 0}
          total={inspectionData?.total_virtual_month ?? 0}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Inspection"
        aboutPageModalData={{
          title: "Inspection",
          description:
            "This page contains a list of Inspection on the platform.",
        }}
        searchInputPlaceholder="Search for Inspection"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        isDateTrue
        filterOptionsMenu={propertyFilterOptionMenu}
        hasGridListToggle={false}
      />
      {inspectionData &&
        inspectionData.card.length === 0 &&
        !isFilteredApplied() &&
        silentLoading &&
        !config.params.search && (
          <EmptyList
            title="No Inspection records yet"
            body={
              <p>
                You currently don&apos;t have any inspection requests. <br />
                Please ensure all your vacant listings are published so
                potential clients can browse them via the mobile app and your
                website. To start receiving inspection bookings, create a
                property record with unit details, and vacant units will
                automatically be available for users to book. <br /> <br />
                To learn more about this page later, click your profile picture
                at the top right of the dashboard and select Assistance &
                Support.
              </p>
            }
          />
        )}

      {(isFilteredApplied() || config.params.search) &&
        inspectionData?.card.length === 0 && <SearchError />}

      <div ref={eleScrollIn}>
        <AutoResizingGrid minWidth={505} gap={32}>
          {inspectionData &&
            inspectionData?.card.map((item) => {
              return <InspectionCard key={item.id} data={item} />;
            })}
        </AutoResizingGrid>
      </div>
      {inspectionData && inspectionData.card.length > 0 && (
        <Pagination
          totalPages={inspectionData?.total_page as number}
          currentPage={inspectionData?.current_page as number}
          onPageChange={handlePageChanger}
        />
      )}
    </div>
  );
};

export default InspectionPage;
