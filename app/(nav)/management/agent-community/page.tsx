"use client";

  import FilterBar from "@/components/FIlterBar/FilterBar";
  import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
  import Button from "@/components/Form/Button/button";
  import ThreadCard, { ThreadSkeleton } from "@/components/Community/ThreadCard";
  import { getThreads } from "./data";
  import Pagination from "@/components/Pagination/pagination";
  import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
  import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
  import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
  import { PlusIcon } from "@/public/icons/icons";
  import { useRouter } from "next/navigation";
  import { useEffect, useMemo, useState } from "react";
  import useFetch from "@/hooks/useFetch";
  import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
  import CustomLoader from "@/components/Loader/CustomLoader";
  import NetworkError from "@/components/Error/NetworkError";
import EmptyList from "@/components/EmptyList/Empty-List";
import { stateOptions } from "../../tasks/inspections/data";

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

       const handleSort = (order: "asc" | "desc") => {
         setSortOrder(order);
       };
       
    const initialState:ThreadApiResponse = {
        data: [],
        meta: {
          last_page: 1,
          current_page: 1,
          total_items: 0,
          current_month_posts: 0,
          total: 0,
        },
        isLoading: false,
        searchQuery: '',
    }
    const [state, setState] = useState(initialState);
    const { data, isLoading, searchQuery, meta } = state;

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

  const config = useMemo(
    () => ({
      params: {
        page: meta?.current_page,
        search: searchQuery,
        sort_order: sortOrder,
      },
    }),
    [meta?.current_page, searchQuery, sortOrder]
  );

  const handleSearch = async (query: string) => {
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
  } = useFetch<ThreadApiResponse>("agent_community", config);

  useRefetchOnEvent("refetchThreads", () => refetch({ silent: true }));

  useEffect(() => {
    // console.log("apiData", apiData);
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
    router.push("/tasks/agent-community/my-articles/create");
  };

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
        searchInputPlaceholder="Search for Agent Community"
        handleFilterApply={() => {}}
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
      />
      {data.length === 0 && !silentLoading ? (
        searchQuery ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No Article found
          </div>
        ) : (
          <section>
            <EmptyList
              buttonText="+ Create New Article"
              buttonLink="/tasks/agent-community/my-articles/create"
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
          ) : data.length === 0 ? (
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
            data.map((thread, index) => (
              <ThreadCard
                key={index}
                id={index}
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
                slug={thread.post.slug}
                shareLink={thread.post.share_link}
                video={thread.post.video_link}
              />
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
