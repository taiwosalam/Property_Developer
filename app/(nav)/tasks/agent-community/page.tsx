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
import { stateOptions } from "../inspections/data";
import { useEffect, useState } from "react";

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

const AgentCommunityPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const handleCreateArticleClick = () => {
    router.push("/tasks/agent-community/my-articles/create");
  };

  useEffect(() => {
    const fetchThreads = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const {data} = await getThreads();
        setThreads(data);
        console.log('Threads data:', data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch threads');
        console.error('Error fetching threads:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, []);

  console.log("threads", threads);
  return (
    <div className="space-y-7">
      <div className="flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Thread"
          colorScheme={1}
          newData={34}
          total={657}
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
        onStateSelect={() => {}}
        pageTitle="Agent Community"
        aboutPageModalData={{
          title: "Agent Community",
          description:
            "This page contains a list of Agent Community on the platform.",
        }}
        searchInputPlaceholder="Search for Agent Community"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={stateOptions}
        article={true}
      />

      <AutoResizingGrid minWidth={300}>
        {isLoading ? (
          Array(threads.length || 3).fill(null).map((_, index) => (
            <ThreadSkeleton key={index} />
          ))
        ) : threads.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No Thread found
          </div>
        ) : (
          threads.map((thread, index) => (
            <ThreadCard
              key={index}
              id={index}
              name={thread.user.name}
              picture_url={thread.user.picture_url}
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
            />
          ))
        )}
      </AutoResizingGrid>
      <div className="pagination">
        <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
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
