"use client";

import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/Form/Button/button";
import ThreadCard, { ThreadSkeleton } from "@/components/Community/ThreadCard";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import { getLoggedInUserThreads, threadData } from "../data";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/public/icons/icons";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import useFetch from "@/hooks/useFetch";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { ArticlesRequestParams } from "../type";
import { AxiosRequestConfig } from "axios";
import dayjs from "dayjs";
import { stateOptions } from "@/app/(nav)/tasks/inspections/data";
import SearchError from "@/components/SearchNotFound/SearchNotFound";
import { FilterResult } from "@/components/Management/Landlord/types";

const lists = [
  {
    title: "All Property Request",
    desc: "Review and respond to property needs and requests from other real estate agents within your network. Strengthen business connections and explore profit-sharing opportunities by fulfilling portfolio demands together for mutual success.",
    link: "/management/agent-community/property-request",
  },
  {
    title: "My Articles",
    desc: "Assess the Articles youve initiated, any modifications made to it, and its overall performance.",
    link: "/management/agent-community/my-articles",
  },
  {
    title: "My Properties Request",
    desc: "Evaluate the property request you've generated, comments received, and how you've managed them.",
    link: "/management/agent-community/my-properties-request",
  },
];
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
  isLoading: boolean;
  searchQuery: string;
}
const MyArticlePage = () => {
  const router = useRouter();
  const initialState: ThreadApiResponse = {
    data: [],
    meta: {
      pagination: {
        last_page: 1,
        current_page: 1,
        total: 0,
      },
      total_posts: 0,
      recent_posts: 0,
    },
    isLoading: false,
    searchQuery: "",
  };
  const [state, setState] = useState(initialState);
  const { data, isLoading, searchQuery, meta } = state;
  const [isFetching, setIsFetching] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [appliedFilters, setAppliedFilters] = useState<FilterResult>({
    options: [],
    menuOptions: {},
    startDate: null,
    endDate: null,
  });

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

  const handleFilterApply = (filters: FilterResult) => {
    setAppliedFilters(filters);
    const { menuOptions, startDate, endDate, options } = filters;
    const statesArray = menuOptions["State"] || [];

    const queryParams: ArticlesRequestParams = {
      page: 1,
      sort: "asc",
      search: "",
    };
    options.forEach(option => {
      if (option === 'all') {
        queryParams.all = true;
      } else if (option === 'trending') {
        queryParams.trending = true;
      } else if (option === 'new') {
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

    console.log({ menuOptions, startDate, endDate, options })
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
  };

  const handleSearch = async (query: string): Promise<void> => {
    if (!query && !searchQuery) return;
    setState((prevState) => ({
      ...prevState,
      searchQuery: query,
    }));
  };

  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<ThreadApiResponse>("/agent_community/user/posts", config);
  useRefetchOnEvent("refetchThreads", () => refetch({ silent: true }));

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

  if (loading)
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="animate-spin w-8 h-8 border-4 border-brand-9 border-t-transparent rounded-full"></div>
      </div>
    );

  if (isNetworkError) return <NetworkError />;

  if (error) return <div>{error}</div>;

  const handleCreateMyArticleClick = () => {
    router.push("/management/agent-community/my-articles/create");
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
        <Modal>
          <ModalTrigger asChild>
            <Button type="button" className="page-header-button">
              + Community Board
            </Button>
          </ModalTrigger>
          <ModalContent>
            <CommunityBoardModal lists={lists} />
          </ModalContent>
        </Modal>
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

      <section className="capitalize">
        {data.length === 0 && !silentLoading ? (
          config.params.search || isFilterApplied() ? (
            <SearchError />
          ) : (
            <EmptyList
              buttonText="+ create article"
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
            {silentLoading ? (
              <>
                <ThreadSkeleton />
                <ThreadSkeleton />
                <ThreadSkeleton />
              </>
            ) : data && data.length > 0 ? (
              data.map((thread, index) => (
                <ThreadCard
                  key={index}
                  slug={thread.post.slug}
                  id={thread.post.id}
                  name={thread.user.name}
                  picture_url={
                    thread.post.media && thread.post.media.length > 0
                      ? thread.post.media[0].path
                      : undefined
                  }
                  role={thread.user.role}
                  time={thread.post.created_at}
                  title={thread.post.title}
                  desc={thread.post.content}
                  comments={thread.post.comments_count}
                  user_pics={thread.user.picture}
                  likes={thread.post.likes_up}
                  dislikes={thread.post.likes_down}
                  shareLink={thread.post.share_link}
                  myArticle={true}
                  video={thread.post.video_link}
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
        <div className="top-80 right-4 fixed rounded-full">
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
