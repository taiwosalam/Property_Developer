"use client";

import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import React from "react";
import Button from "@/components/Form/Button/button";
import ThreadCard from "@/components/Community/ThreadCard";
import Pagination from "@/components/Pagination/pagination";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import { threadData } from "../data";

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
  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Thread"
          newData={34}
          total={657}
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
        onStateSelect={() => {}}
        pageTitle="My Articles"
        aboutPageModalData={{
          title: "My Articles",
          description:
            "This page contains a list of My Articles on the platform.",
        }}
        searchInputPlaceholder="Search Articles"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={[]}
      />

      <div className="thread_card grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {threadData.map(
          (
            { name, picture_url, role, time, title, desc, comments, user_pics },
            index
          ) => (
            <ThreadCard
              key={index}
              name={name}
              picture_url={picture_url}
              role={role}
              time={time}
              title={title}
              desc={desc}
              comments={comments}
              user_pics={user_pics}
              myArticle={true}
              id={index}
            />
          )
        )}
      </div>
      <div className="pagination">
        <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
      </div>
    </div>
  );
};

export default MyArticlePage;
