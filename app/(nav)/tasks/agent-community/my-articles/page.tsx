"use client";

import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { useEffect, useState } from "react";
import Button from "@/components/Form/Button/button";
import ThreadCard, { ThreadSkeleton } from "@/components/Community/ThreadCard";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import { getLoggedInUserThreads, threadData } from "../data";
import { useRouter } from "next/navigation";
import { PlusIcon } from "@/public/icons/icons";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";

const lists = [
  {
    title: "All Property Request",
    desc: "Review and respond to property needs and requests from other real estate agents within your network. Strengthen business connections and explore profit-sharing opportunities by fulfilling portfolio demands together for mutual success.",
    link: "/tasks/agent-community/property-request",
  },
  {
    title: "My Articles",
    desc: "Assess the Articles youve initiated, any modifications made to it, and its overall performance.",
    link: "/tasks/agent-community/my-articles",
  },
  {
    title: "My Properties Request",
    desc: "Evaluate the property request you've generated, comments received, and how you've managed them.",
    link: "/tasks/agent-community/my-properties-request",
  },
];

const MyArticlePage = () => {
  const router = useRouter();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredThreads, setFilteredThreads] = useState<any[]>([]);

  useEffect(() => {
    const fetchThreads = async () => {
      setIsFetching(true);
      setError(null);
      try {
        const { data } = await getLoggedInUserThreads();
        console.log('Threads data:', data);
        setThreads(data.original.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch threads');
        console.error('Error fetching threads:', err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchThreads();
  }, []);

  useEffect(() => {
    if (!threads) return;
    
    const filtered = threads.filter((thread) =>
      thread.post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredThreads(filtered);
  }, [searchQuery, threads]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // console.log()

  const handleCreateMyArticleClick = () => {
    router.push("/tasks/agent-community/my-articles/create");
  };

  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Thread"
          newData={34}
          total={657}
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
        onStateSelect={() => { }}
        pageTitle="My Articles"
        aboutPageModalData={{
          title: "My Articles",
          description:
            "This page contains a list of My Articles on the platform.",
        }}
        searchInputPlaceholder="Search Articles"
        handleSearch={handleSearch}
        handleFilterApply={() => {}}
        searchQuery={searchQuery}
      />

      <AutoResizingGrid minWidth={300}>
        {isFetching ? (
          Array(threads?.length || 3).fill(null).map((_, index) => (
            <ThreadSkeleton key={index} />
          ))
        ) : filteredThreads && filteredThreads.length > 0 ? (
          filteredThreads.map((thread, index) => (
            <ThreadCard
              key={index}
              slug={thread.post.slug}
              id={thread.post.id}
              name={thread.user.name}
              picture_url={thread.post.media && thread.post.media.length > 0 
                ? thread.post.media[0].path 
                : undefined}
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
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No Article found
          </div>
        )}
      </AutoResizingGrid>
      <div className="pagination">
        <Pagination totalPages={5} currentPage={1} onPageChange={() => { }} />
      </div>
      <div className="top-80 right-4 fixed rounded-full">
        <button
          onClick={handleCreateMyArticleClick}
          className="bg-brand-9 rounded-full text-white p-4 shadow-lg"
        >
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

export default MyArticlePage;
