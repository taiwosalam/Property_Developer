"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { getPropertyRequests, PropertyRequestDataType } from "./data";
import { AgentCommunityRequestCardProps } from "@/components/tasks/CallBack/types";
import Button from "@/components/Form/Button/button";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import Pagination from "@/components/Pagination/pagination";
import { PlusIcon } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { empty } from "@/app/config";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import EmptyList from "@/components/EmptyList/Empty-List";
import NetworkError from "@/components/Error/NetworkError";
import { stateOptions } from "@/app/(nav)/tasks/inspections/data";
import { FilterResult } from "@/components/Management/Landlord/types";
import dayjs from "dayjs";
import { AxiosRequestConfig } from "axios";
import { formatNumber } from "@/utils/number-formatter";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { PropertyRequestParams } from "../agent-community/type";
import { RequestCardSkeleton } from "../agent-community/components";

interface PropertyRequestApiData {
  data: PropertyRequestDataType[];
  meta: {
    current_month_requests: number;
    total_requests: number;
    pagination: {
      current_page: number;
      total: number;
      last_page: number;
    };
  };
}

const transformToPropertyRequestCardProps = (
  data: PropertyRequestDataType
): AgentCommunityRequestCardProps => {
  return {
    cardType: "agent-community",
    cardViewDetails: [
      { label: "Local Government", accessor: "lga" },
      { label: "Property Type", accessor: "propertyType" },
      { label: "Category", accessor: "category" },
      { label: "Min Budget", accessor: "minBudget" },
      { label: "Max Budget", accessor: "maxBudget" },
      { label: "Target Audience", accessor: "targetAudience" },
    ],
    ...data,
  };
};

const PropertyRequest = () => {
  const router = useRouter();
  const initialState: PropertyRequestApiData = {
    data: [],
    meta: {
      current_month_requests: 0,
      total_requests: 0,
      pagination: {
        current_page: 1,
        total: 0,
        last_page: 1,
      },
    },
  };

  const [state, setState] = useState<PropertyRequestApiData>(initialState);

  const {
    data,
    meta: {
      current_month_requests,
      total_requests,
      pagination: { current_page, total, last_page },
    },
  } = state;

  const handleCreatePropertyRequestClick = () => {
    router.push("/management/agent-request/my-properties-request/create");
  };

  // const [searchQuery, setSearchQuery] = useState("");

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
      sort: "asc",
    } as PropertyRequestParams,
  });

  const handlePageChange = (page: number) => {
    setConfig({
      params: { ...config.params, page },
    });
  };

  const handleSearch = async (query: string) => {
    setConfig({
      params: { ...config.params, search: query },
    });
  };

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

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order },
    });
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate, options } = filters;
    const statesArray = menuOptions["State"] || [];

    const queryParams: PropertyRequestParams = {
      page: 1,
      sort: "desc",
      search: "",
    };

    options.forEach((option) => {
      if (option === "new") {
        queryParams.current_month = true;
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
    error,
    refetch,
    silentLoading,
    isNetworkError,
  } = useFetch<PropertyRequestApiData>(
    `/agent-community/property-requests/all`,
    config
  );

  useRefetchOnEvent("refetchPropertyRequests", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      console.log("api data", apiData);
      setState((prevState) => ({
        ...prevState,
        data: apiData.data,
        meta: apiData.meta,
      }));
    }
  }, [apiData]);

  const propertyRequestData = getPropertyRequests(data);

  console.log("propertyRequestData", data)

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  if (error)
    return <p className="text-base text-red-500 font-medium">{error}</p>;

  return (
    <div className="space-y-9">
      <div className="flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Request"
          newData={current_month_requests}
          total={total_requests}
          colorScheme={1}
          className="hidden md:block"
        />
        <div className="w-full flex justify-center items-center md:justify-end md:w-auto md:items-center">
          <Button
            href="/management/agent-request/my-properties-request"
            type="button"
            className="page-header-button"
          >
            My Property Requests
          </Button>
        </div>
      </div>
      <FilterBar
        azFilter
        pageTitle="Property Request"
        aboutPageModalData={{
          title: "Property Request",
          description:
            "This page contains a list of Property Request on the platform.",
        }}
        searchInputPlaceholder="Search Property Request"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptions={[
          {
            label: "All Property Request",
            value: "all",
          },
          {
            label: "Trending Property Request",
            value: "trending",
          },
          {
            label: "New Property Request",
            value: "new",
          },
        ]}
        hasGridListToggle={false}
        filterOptionsMenu={stateOptions}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
      />
      {propertyRequestData.length === 0 && !silentLoading ? (
        config.params.search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <section>
            <EmptyList
              buttonText="+ Create New Property Request"
              buttonLink="/management/agent-community/my-properties-request/create"
              title="The property request files are empty"
              body={
                <p>
                  Create a property request by clicking on the &quot;Create New
                  Property Request&quot; button.
                </p>
              }
            />
          </section>
        )
      ) : (
        <AutoResizingGrid gap={28} minWidth={400}>
          {silentLoading ? (
            <>
              <RequestCardSkeleton />
              <RequestCardSkeleton />
              <RequestCardSkeleton />
            </>
          ) : (
            propertyRequestData.map((details, index) => (
              <PropertyRequestCard
                key={index}
                {...transformToPropertyRequestCardProps(details)}
              />
            ))
          )}
        </AutoResizingGrid>
      )}
      <div className="pagination">
        <Pagination
          totalPages={last_page}
          currentPage={current_page}
          onPageChange={handlePageChange}
        />
      </div>

      <div className="top-80 right-4 fixed rounded-full">
        <button
          onClick={handleCreatePropertyRequestClick}
          className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default PropertyRequest;
