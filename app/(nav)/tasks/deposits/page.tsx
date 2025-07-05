"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import DepositRequestCard from "@/components/tasks/CallBack/RequestCard";
import { type DepositRequestCardProps } from "@/components/tasks/CallBack/types";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  DepositRequestData,
  depositRequestOptionsWithDropdown,
  ICautionPageData,
  transformCautionDeposit,
  type DepositRequestDataType,
} from "./data";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { useEffect, useRef, useState } from "react";
import useFetch from "@/hooks/useFetch";
import { ICautionApiResponse } from "./type";
import { AxiosRequestConfig } from "axios";
import { FilterResult, InspectionRequestParams } from "../inspections/data";
import dayjs from "dayjs";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import Pagination from "@/components/Pagination/pagination";
import { hasActiveFilters } from "../../reports/data/utils";
import EmptyList from "@/components/EmptyList/Empty-List";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { IPropertyApi } from "../../settings/others/types";
import CardsLoading from "@/components/Loader/CardsLoading";
import CustomLoader from "@/components/Loader/CustomLoader";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import PropertyRequestPageLoader from "@/components/Loader/property-request-page-loader";

const transformToDepositRequestCardProps = (
  data: DepositRequestDataType
): DepositRequestCardProps => {
  return {
    cardType: "deposit",
    cardViewDetails: [
      { label: "Property Name", accessor: "propertyName" },
      { label: "Location (State)", accessor: "state" },
      { label: "Unit Details", accessor: "unitDetails" },
      { label: "Amount", accessor: "amount" },
      { label: "Branch", accessor: "branch" },
    ],
    ...data,
  };
};

const DepositRequest = () => {
  const [pageData, setPageData] = useState<ICautionPageData | null>(null);
  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
    } as InspectionRequestParams,
  });

  const eleScrollIn = useRef<HTMLDivElement | null>(null);

  const [appliedFilter, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const handleFilterApply = (filter: FilterResult) => {
    setAppliedFilters(filter);
    const { menuOptions, startDate, endDate } = filter;
    const propertyIdArray = menuOptions["Property"] || [];

    const queryParams: InspectionRequestParams = {
      page: 1,
      search: "",
    };
    if (startDate) {
      queryParams.from = dayjs(startDate).format("YYYY-MM-DD");
    }
    if (endDate) {
      queryParams.to = dayjs(endDate).format("YYYY-MM-DD");
    }
    if (propertyIdArray.length > 0) {
      queryParams.property_id = propertyIdArray.join(",");
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
    data: cautionData,
    loading,
    silentLoading,
    error,
    isNetworkError,
    refetch,
  } = useFetch<ICautionApiResponse>(`cautions-deposit/company`, config);
  useRefetchOnEvent("dispatchDeposit", () => refetch({ silent: true }));

  useEffect(() => {
    if (cautionData) {
      const transformData = transformCautionDeposit(cautionData);
      setPageData(transformData);
    }
  }, [cautionData]);

  const { data: propertiesData } = useFetch<IPropertyApi>(`/property/list`);

  const propertyOptions = Array.isArray(propertiesData?.data.properties.data)
    ? [
        ...new Map(
          propertiesData.data.properties.data.map((property: any) => [
            property.title, // Use property title as the unique key
            {
              label: property.title,
              value: property.id.toString(),
            },
          ])
        ).values(),
      ]
    : [];

  if (isNetworkError) {
    return <NetworkError />;
  }
  if (loading) {
    return <PropertyRequestPageLoader pageTitle="Caution Deposit Request" />;
  }
  if (error) {
    <ServerError error={error} />;
  }

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Requests"
          newData={pageData?.total_request || 0}
          total={pageData?.total_request_month || 0}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Completed"
          newData={pageData?.total_completed || 0}
          total={pageData?.total_completed_month || 0}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Pending"
          newData={pageData?.total_pending || 0}
          total={pageData?.total_month_pending || 0}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Caution Deposit Request"
        aboutPageModalData={{
          title: "Caution Deposit Request",
          description:
            "This page contains a list of Caution Deposit Request on the platform.",
        }}
        searchInputPlaceholder="Search Deposit Record"
        handleFilterApply={handleFilterApply}
        handleSearch={handleSearch}
        onSort={handleSort}
        isDateTrue
        filterOptionsMenu={[
          ...(propertyOptions?.length > 0
            ? [
                {
                  label: "Property",
                  value: propertyOptions,
                },
              ]
            : []),
        ]}
        hasGridListToggle={false}
      />

      <section ref={eleScrollIn}>
        {loading || silentLoading ? (
          <AutoResizingGrid gap={28} minWidth={400}>
            <PropertyrequestSkeletonLoader length={10} />
          </AutoResizingGrid>
        ) : !pageData?.deposit?.length ? (
          // Show empty state when no visitors exist
          <EmptyList
            noButton
            title="No Caution Deposit Records Available"
            body={
              <p className="">
                There are currently no caution deposit records linked to your
                properties. Once a deposit is recorded, the details will appear
                here. Caution deposits help you keep track of security deposits
                made by tenants, ensuring accurate management and easy
                reference. <br /> <br />
                <p>
                  This message will automatically disappear once caution deposit
                  records are added.
                </p>{" "}
              </p>
            }
          />
        ) : !!config.params.search || hasActiveFilters(appliedFilter) ? (
          // If we have data but search/filters return nothing, show search error
          pageData?.deposit?.length === 0 ? (
            <SearchError />
          ) : (
            // Show filtered/searched results?
            <section>
              <AutoResizingGrid gap={28} minWidth={400}>
                {pageData?.deposit?.map((details, index) => (
                  <DepositRequestCard
                    key={index}
                    {...transformToDepositRequestCardProps(details)}
                  />
                ))}
              </AutoResizingGrid>
            </section>
          )
        ) : (
          // Show all results when no search/filters active
          <section>
            <AutoResizingGrid gap={28} minWidth={400}>
              {pageData?.deposit?.map((details, index) => (
                <DepositRequestCard
                  key={index}
                  {...transformToDepositRequestCardProps(details)}
                />
              ))}
            </AutoResizingGrid>
          </section>
        )}
      </section>

      <Pagination
        totalPages={pageData?.pagination?.last_page || 0}
        currentPage={pageData?.pagination?.current_page || 0}
        onPageChange={handlePageChanger}
      />
    </div>
  );
};

export default DepositRequest;
