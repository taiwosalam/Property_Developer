"use client";

import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Form/Button/button";
import Pagination from "@/components/Pagination/pagination";
import { transformToThreadCardProps } from "../data";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/public/icons/icons";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { FilterResult } from "@/components/Management/Landlord/types";
import { ArticlesRequestParams } from "../type";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { stateOptions } from "@/app/(nav)/tasks/inspections/data";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import ThreadSkeleton from "@/components/Community/threadskeleton";
import ThreadCard from "@/components/Community/ThreadCard";
import ServerError from "@/components/Error/ServerError";
import { ThreadSkeletonLoader } from "../components";
import PageCircleLoader from "@/components/Loader/PageCircleLoader";
import PropertyRequestPageLoader from "@/components/Loader/property-request-page-loader";

interface ThreadApiResponse {
  data: any[];
  meta: {
    pagination: {
      last_page: number;
      current_page: number;
      total: number;
    };
    total_posts: number;
    recent_posts: number;
  };
}
const MyArticlePage = () => {
  const router = useRouter();
  const [isLikeDislikeLoading, setIsLikeDislikeLoading] = useState(false);
  const initialState: ThreadApiResponse = {
    data: [],
    meta: {
      pagination: {
        last_page: 1,
        current_page: parseInt(
          sessionStorage.getItem("my_article_page") || "1",
          10
        ),
        total: 0,
      },
      total_posts: 0,
      recent_posts: 0,
    },
  };

  const [state, setState] = useState(initialState);
  const { data, meta } = state;

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

  const [config, setConfig] = useState<AxiosRequestConfig>({
    params: {
      page: parseInt(sessionStorage.getItem("my_article_page") || "1", 10),
      search: "",
      sort: "asc",
    } as ArticlesRequestParams,
  });

  // Save page number to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem(
      "my_article_page",
      meta.pagination.current_page.toString()
    );
  }, [meta.pagination.current_page]);

  const handleSort = (order: "asc" | "desc") => {
    setConfig({
      params: { ...config.params, sort: order, page: 1 },
    });
    sessionStorage.setItem("my_article_page", "1");
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
    sessionStorage.setItem("my_article_page", "1");
  };

  const isFilterApplied = () => {
    const { options, menuOptions, startDate, endDate } = appliedFilters;
    return (
      options.length > 0 ||
      Object.keys(menuOptions).some((key) => menuOptions[key].length > 0) ||
      startDate !== null ||
      endDate !== null
    );
  };

  const handlePageChange = (page: number) => {
    setState((prevState) => ({
      ...prevState,
      searchQuery: "",
      meta: {
        ...prevState.meta,
        current_page: page,
      },
    }));
    sessionStorage.setItem("my_article_page", page.toString());
  };

  const handleSearch = (query: string) => {
    setConfig({
      params: { ...config.params, search: query, page: 1 },
    });
    sessionStorage.setItem("my_article_page", "1");
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<ThreadApiResponse>("/agent_community/user/posts", config);
  useRefetchOnEvent("refetchThreads", async () => {
    await refetch({ silent: true });
    window.dispatchEvent(new Event("refetchThreadsDone"));
  });

  useEffect(() => {
    if (apiData) {
      setState((x) => ({
        ...x,
        data: apiData.data,
        meta: apiData.meta,
        last_page: apiData.meta.pagination.last_page,
        current_page: apiData.meta.pagination.current_page,
        total_posts: apiData.meta.pagination.total,
      }));
    }
  }, [apiData]);

  const threads = transformToThreadCardProps(data);

  if (loading)
    return (
      <PropertyRequestPageLoader
        threadCard
        pageTitle="My Articles"
        statCardsLength={1}
      />
    );

  if (isNetworkError) return <NetworkError />;
  if (error) return <ServerError error={error} />;

  const handleCreateMyArticleClick = () => {
    router.push("/community/agent-forum/my-articles/create");
  };

  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Thread"
          newData={meta.recent_posts}
          total={meta.total_posts}
          colorScheme={1}
        />
        <Button
          href="/community/agent-forum"
          type="button"
          className="page-header-button"
        >
          All Community Threads
        </Button>
      </div>
      <FilterBar
        hasGridListToggle={false}
        azFilter
        pageTitle="My Articles"
        aboutPageModalData={{
          title: "My Articles",
          description:
            "This page contains a list of My Articles on the platform.",
        }}
        searchInputPlaceholder="Search Articles"
        handleFilterApply={handleFilterApply}
        isDateTrue
        filterOptionsMenu={stateOptions}
        handleSearch={handleSearch}
        onSort={handleSort}
        appliedFilters={appliedFilters}
      />

      <section className="capitalize">
        {threads.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              buttonText="+ create article"
              buttonLink="/community/agent-forum/my-articles/create"
              title="You have not created any articles yet"
              body={
                <p>
                  Create articles to share your thoughts, ideas, and insights
                  with other agents in your network.
                </p>
              }
            />
          )
        ) : (
          <AutoResizingGrid minWidth={300}>
            {/* {silentLoading ? ( */}
            {silentLoading && !isLikeDislikeLoading ? (
              <ThreadSkeletonLoader length={10} />
            ) : threads && threads.length > 0 ? (
              threads.map((thread, index) => (
                <ThreadCard
                  key={index}
                  {...thread}
                  published={thread.published}
                  myArticle
                  setIsLikeDislikeLoading={setIsLikeDislikeLoading}
                />
              ))
            ) : null}
          </AutoResizingGrid>
        )}
        <div className="pagination">
          <Pagination
            totalPages={meta?.pagination.last_page}
            currentPage={meta?.pagination.current_page}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="bottom-4 right-4 fixed rounded-full">
          <button
            onClick={handleCreateMyArticleClick}
            className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
          >
            <PlusIcon />
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyArticlePage;
