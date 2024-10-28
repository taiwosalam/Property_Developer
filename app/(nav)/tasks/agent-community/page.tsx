"use client";

import FilterBar from "@/components/FIlterBar/FilterBar";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import React from "react";
import { complaintsFilterOptionsWithDropdown } from "../complaints/data";
import Button from "@/components/Form/Button/button";
import ThreadCard from "@/components/Community/ThreadCard";
import { threadData } from "./data";
import Pagination from "@/components/Pagination/pagination";

const page = () => {
  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Thread"
          newData={34}
          total={657}
        />
        <Button
          type="button"
          className="bg-brand-9 text-white px-4 py-2 rounded-lg"
        >
          + Community Board
        </Button>
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
            />
          )
        )}
      </div>
      <div className="pagination">
        <Pagination
          totalPages={5}
          currentPage={1}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
};

export default page;
