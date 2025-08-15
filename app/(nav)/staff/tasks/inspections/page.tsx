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
import {
  InspectionDataApiResponse,
  InspectionPageType,
  PropertyListResponse,
} from "./type";
import { useEffect, useRef, useState } from "react";
import NetworkError from "@/components/Error/NetworkError";
import MessageCardSkeleton from "@/components/Skeleton/message-card-skeleton";
import CustomLoader from "@/components/Loader/CustomLoader";
import EmptyList from "@/components/EmptyList/Empty-List";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { hasActiveFilters } from "@/app/(nav)/reports/data/utils";
import ServerError from "@/components/Error/ServerError";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

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

  const [allProperties, setAllProperties] = useState<
    Array<{ label: string; value: string }>
  >([]);
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
    const propertyIdArray = menuOptions["Property"] || [];

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
    if (propertyIdArray.length > 0) {
      queryParams.property_ids = propertyIdArray.join(",");
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
    error,
    loading,
    silentLoading,
    refetch,
  } = useFetch<InspectionDataApiResponse>(`inspections`, config);

  useRefetchOnEvent("dispatchInspection", () => refetch({ silent: true }));

  const { data: propertyData } = useFetch<PropertyListResponse>(`property/all`);

  useEffect(() => {
    if (apiData) {
      const transformData = transformInspectionCard(apiData);
      setInspectionData(transformData);
    }
  }, [apiData]);

  const propertyFilterOptionMenu = [
    {
      label: "Property",
      value: allProperties,
    },
  ];

  useEffect(() => {
    if (propertyData) {
      const uniqueProperties = new Set();
      const properties = propertyData.data
        .filter(
          (item) => item?.property_type === "rental" && item?.units.length > 0
        ) // Filter for rental properties only
        .map((item) => {
          if (item?.title && !uniqueProperties.has(item.title)) {
            uniqueProperties.add(item.title);
            return {
              label: item.title,
              value: item.id.toString(),
            };
          }
          return null;
        })
        .filter(
          (item): item is { label: string; value: string } => item !== null
        );

      setAllProperties(properties);
    }
  }, [propertyData]);

  if (isNetworkError) {
    return <NetworkError />;
  }

  if (loading)
    return (
      <CustomLoader layout="page" pageTitle="Inspection" statsCardCount={3} />
    );
  if (error) {
    return <ServerError error={error} />;
  }

  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Inspections"
          newData={inspectionData?.total_months ?? 0}
          total={inspectionData?.total_inspections ?? 0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Physical Inspections"
          newData={inspectionData?.total_physical_month ?? 0}
          total={inspectionData?.total_physical ?? 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Virtual Inspections"
          newData={inspectionData?.total_virtual_month ?? 0}
          total={inspectionData?.total_virtual ?? 0}
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

      <section ref={eleScrollIn}>
        {loading || silentLoading ? (
          <AutoResizingGrid minWidth={505} gap={32}>
            <PropertyrequestSkeletonLoader length={10} />
          </AutoResizingGrid>
        ) : inspectionData?.card?.length === 0 ? (
          !!config.params?.search || hasActiveFilters(appliedFilter) ? (
            <SearchError />
          ) : (
            <div className="col-span-full text-left py-8 text-gray-500">
              <EmptyList
                noButton
                title="No Inspection Records Yet"
                body={
                  <p className="">
                    Currently, there are no inspection records linked to your
                    property listings. Once a potential client submits an
                    inspection request, the details will appear here, allowing
                    you to view and book appointments. <br /> <br />
                    <br />
                  </p>
                }
              />
            </div>
          )
        ) : (
          <AutoResizingGrid minWidth={505} gap={32}>
            {inspectionData &&
              inspectionData?.card.map((item) => (
                <InspectionCard key={item?.id} data={item} />
              ))}
          </AutoResizingGrid>
        )}
      </section>

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
