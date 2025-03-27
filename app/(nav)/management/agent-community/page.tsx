"use client";
// TYPES
import { ArticlesRequestParams } from "./type";

// IMPORTS
import { useEffect, useMemo, useState } from "react";
import FilterBar from "@/components/FIlterBar/FilterBar";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import Button from "@/components/Form/Button/button";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { PlusIcon } from "@/public/icons/icons";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { stateOptions } from "../../tasks/inspections/data";
import { FilterResult } from "@/components/Management/Landlord/types";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import ThreadSkeleton from "@/components/Community/threadskeleton";
import ThreadCard from "@/components/Community/ThreadCard";
import { transformToThreadCardProps } from "./data";


interface ThreadApiResponse {
  data: any[];
  meta: {
    last_page: number;
    current_page: number;
    total_items: number;
    current_month_posts: number;
    total: number;
  };
  isLoading: boolean;
  searchQuery: string;
}

const AgentCommunityPage = () => {
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const initialState: ThreadApiResponse = {
    data: [],
    meta: {
      last_page: 1,
      current_page: 1,
      total_items: 0,
      current_month_posts: 0,
      total: 0,
    },
    isLoading: false,
    searchQuery: "",
  };
  const [state, setState] = useState(initialState);
  const { data, isLoading, searchQuery, meta } = state;

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
    } as ArticlesRequestParams,
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

    const queryParams: ArticlesRequestParams = {
      page: 1,
      sort: "asc",
      search: "",
    };

    options.forEach((option) => {
      if (option === "all") {
        queryParams.all = true;
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

    // console.log({ menuOptions, startDate, endDate, options })
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<ThreadApiResponse>("agent_community", config);

  useRefetchOnEvent("refetchThreads", () => refetch({ silent: true }));

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...x,
        data: apiData.data,
        meta: apiData.meta,
        total_pages: apiData.meta.last_page,
        current_page: apiData.meta.current_page,
        total: apiData.meta.total,
      }));
    }
  }, [apiData]);

  const handleCreateArticleClick = () => {
    router.push("/management/agent-community/my-articles/create");
  };

  // THREADS DATA FORMATTED FOR THREADCARD
  const threads = transformToThreadCardProps(data);

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  if (error) return <div>{error}</div>;

  // console.log("threads", data);
  return (
    <div className="space-y-7">
      <div className="flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Thread"
          colorScheme={1}
          newData={meta?.current_month_posts}
          total={meta?.total}
          className="hidden md:block"
        />
        <div className="w-full flex justify-center items-center md:justify-end md:w-auto md:items-center">
          <Button
            href="/management/agent-community/my-articles"
            className="page-header-button"
          >
            My Articles
          </Button>
        </div>
      </div>
      <FilterBar
        hasGridListToggle={false}
        azFilter
        pageTitle="Agent Community"
        aboutPageModalData={{
          title: "Agent Community",
          description:
            "This page contains a list of Agent Community on the platform.",
        }}
        searchInputPlaceholder="Search in or within Agent Community"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptionsMenu={stateOptions}
        filterOptions={[
          {
            label: "All Articles",
            value: "all",
          },
          {
            label: "Trending Articles",
            value: "trending",
          },
          {
            label: "New Articles",
            value: "new",
          },
        ]}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
      />
      {data.length === 0 && !silentLoading ? (
        config.params.search || isFilterApplied() ? (
          <SearchError />
        ) : (
          <section>
            <EmptyList
              buttonText="+ Create New Article"
              buttonLink="/management/agent-community/my-articles/create"
              title="You do not have any articles"
              body={
                <p>
                  Create an article by clicking on the &quot;Create New
                  Article&quot; button.
                </p>
              }
            />
          </section>
        )
      ) : (
        <AutoResizingGrid minWidth={300}>
          {silentLoading ? (
            <>
              <ThreadSkeleton />
              <ThreadSkeleton />
              <ThreadSkeleton />
            </>
          ) : threads.length === 0 ? (
            <section>
              <EmptyList
                buttonText="+ Create New Article"
                buttonLink="/management/agent-community/my-articles/create"
                title="You do not have any articles"
                body={
                  <p>
                    Create an article by clicking on the &quot;Create New
                    Article&quot; button.
                  </p>
                }
              />
            </section>
          ) : (
            threads.map((thread, index) => (
              <ThreadCard key={index} {...thread} />
            ))
          )}
        </AutoResizingGrid>
      )}
      <div className="pagination">
        <Pagination
          totalPages={meta?.last_page}
          currentPage={meta?.current_page}
          onPageChange={handlePageChange}
        />
      </div>
      <div className="top-80 right-5 fixed rounded-full">
        <button
          onClick={handleCreateArticleClick}
          className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default AgentCommunityPage;
