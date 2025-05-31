"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { PlusIcon } from "lucide-react";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import Button from "@/components/Form/Button/button";
import Pagination from "@/components/Pagination/pagination";
import EmptyList from "@/components/EmptyList/Empty-List";
import NetworkError from "@/components/Error/NetworkError";
import ServerError from "@/components/Error/ServerError";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { PropertyrequestSkeletonLoader } from "@/components/Loader/property-request-loader";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import { stateOptions } from "@/app/(nav)/tasks/inspections/data";
import { FilterResult } from "@/components/Management/Landlord/types";
import { PropertyRequestParams } from "../../agent-forum/type";
import { transformToAgentCommunityCardProps } from "./data";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";

interface ApiPropertyRequest {
  id: number;
  slug: string;
  title: string;
  published: number;
  professional_title: string;
  description: string;
  property_category: string;
  property_type: string;
  property_sub_type: string | null;
  state: string;
  lga: string;
  agent: string;
  min_budget: string;
  max_budget: string;
  start_date: string;
  end_date: string;
  created_at: string;
  share_link: string;
}

interface ApiUser {
  id: number;
  name: string;
  phone: string;
  picture: string;
  professional_title: string;
  title: string;
  profile_title: string;
  tier: string;
  company_is_verified: string | null;
  company_status: string | null;
}

interface ApiDataItem {
  propertyRequest: ApiPropertyRequest;
  user: ApiUser;
}

interface PropertyRequestApiData {
  data: ApiDataItem[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    total_requests: number;
    newly_created_requests: number;
  };
}

const MyPropertiesRequestPage = () => {
  const router = useRouter();

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: 1,
      search: "",
      sort: "desc",
    } as PropertyRequestParams,
  });

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const {
    data: apiData,
    loading,
    error,
    refetch,
    silentLoading,
    isNetworkError,
  } = useFetch<PropertyRequestApiData>("/agent_requests/user", config);

  useRefetchOnEvent("refetchPropertyRequests", () => refetch({ silent: true }));

  const propertyRequestCardsData = apiData?.data
    ? transformToAgentCommunityCardProps(apiData.data)
    : [];

  const isFilterApplied = () =>
    appliedFilters.options.length > 0 ||
    Object.keys(appliedFilters.menuOptions).some(
      (key) => appliedFilters.menuOptions[key].length > 0
    ) ||
    appliedFilters.startDate !== null ||
    appliedFilters.endDate !== null;

  const handlePageChange = (page: number) => {
    setConfig((prev) => ({
      params: { ...prev.params, page },
    }));
  };

  const handleSearch = (query: string) => {
    setConfig((prev) => ({
      params: { ...prev.params, search: query, page: 1 },
    }));
  };

  const handleSort = (order: "asc" | "desc") => {
    setConfig((prev) => ({
      params: { ...prev.params, sort: order },
    }));
  };

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate, options } = filters;
    const statesArray = menuOptions["State"] || [];

    const queryParams: PropertyRequestParams = {
      page: 1,
      sort: "desc",
      search: config.params.search || "",
    };

    if (options.includes("new")) {
      queryParams.current_month = true;
    }
    if (statesArray.length > 0) {
      queryParams.state = statesArray.join(",");
    }
    if (startDate) {
      queryParams.start_date = dayjs(startDate).format("YYYY-MM-DD HH:mm:ss");
    }
    if (endDate) {
      queryParams.end_date = dayjs(endDate).format("YYYY-MM-DD HH:mm:ss");
    }

    setConfig({ params: queryParams });
  };

  const handleCreatePropertyRequestClick = () => {
    router.push("/community/agent-request/my-properties-request/create");
  };

  if (loading) return <PageCircleLoader />;
  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  return (
    <div className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Request"
          newData={apiData?.meta.newly_created_requests || 0}
          colorScheme={1}
          total={apiData?.meta.total_requests || 0}
        />
        <Button
          href="/community/agent-request"
          type="button"
          className="page-header-button"
        >
          All Property Requests
        </Button>
      </div>
      <FilterBar
        azFilter
        pageTitle="My Properties Request"
        aboutPageModalData={{
          title: "My Properties Request",
          description:
            "This page contains a list of My Properties Request on the platform.",
        }}
        searchInputPlaceholder="Search My Properties Request"
        handleFilterApply={handleFilterApply}
        isDateTrue
        hasGridListToggle={false}
        filterOptionsMenu={stateOptions}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
      />
      {propertyRequestCardsData.length === 0 && !silentLoading ? (
        config.params.search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <EmptyList
            buttonText="+ Create New Property Request"
            buttonLink="/community/agent-request/my-properties-request/create"
            title="You do not have any property requests"
            body={
              <p>
                Click the &quot;Create New Property Request&quot; button to
                submit a request. This will help you connect with other real
                estate professionals and receive relevant property options that
                match your client&apos;s needs.
              </p>
            }
          />
        )
      ) : (
        <AutoResizingGrid gap={28} minWidth={400}>
          {silentLoading ? (
            <PropertyrequestSkeletonLoader length={10} />
          ) : (
            propertyRequestCardsData.map((cardProps, index) => (
              <PropertyRequestCard
                key={cardProps.requestId}
                {...cardProps}
                user
              />
            ))
          )}
        </AutoResizingGrid>
      )}
      <div className="pagination">
        <Pagination
          totalPages={apiData?.meta.last_page || 1}
          currentPage={apiData?.meta.current_page || 1}
          onPageChange={handlePageChange}
        />
      </div>
      <div className="fixed bottom-4 right-4">
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

export default MyPropertiesRequestPage;
