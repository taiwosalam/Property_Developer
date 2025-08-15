"use client";
import React from "react";

// Imports
import ApplicationCard from "@/components/Applications/application-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { DocumentssFilterOptionsWithDropdown } from "../../manager/documents/data";

const Applications = () => {
  return (
    <div className="custom-flex-col gap-8">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Application"
          newData={34}
          total={657}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Mobile Application"
          newData={34}
          total={657}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Web Application"
          newData={34}
          total={657}
          colorScheme={3}
        />
      </div>
      <div className="custom-flex-col gap-5">
        <FilterBar
          azFilter
          isDateTrue
          hasGridListToggle={false}
          pageTitle="Applications"
          aboutPageModalData={{
            title: "Applications",
            description:
              "This page contains a list of Applications on the platform.",
            video: "",
          }}
          searchInputPlaceholder="Search application"
          handleFilterApply={() => {}}
          filterOptionsMenu={DocumentssFilterOptionsWithDropdown}
        />
        <AutoResizingGrid minWidth={300} gap={32}>
          <ApplicationCard status="flagged" type="pending" />
          <ApplicationCard status="unflagged" type="pending" />
          <ApplicationCard status="unflagged" type="pending" />
        </AutoResizingGrid>
      </div>
    </div>
  );
};

export default Applications;
