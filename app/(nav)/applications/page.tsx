"use client"
import React from "react";

// Imports
import ApplicationCard from "@/components/Applications/application-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Applications = () => {
  return (
    <div className="custom-flex-col gap-8">
      <AutoResizingGrid minWidth={270}>
        <ManagementStatistcsCard
          title="Total Application"
          newData={34}
          total={657}
        />
        <ManagementStatistcsCard
          title="Mobile Application"
          newData={34}
          total={657}
        />
        <ManagementStatistcsCard
          title="Web Application"
          newData={34}
          total={657}
        />
      </AutoResizingGrid>
      <div className="custom-flex-col gap-5">
        <FilterBar azFilter isDateTrue onStateSelect={() => { }} pageTitle="Applications" aboutPageModalData={
          { title: "Applications", description: "This page contains a list of Applications on the platform." }
        } searchInputPlaceholder="Search for units" handleFilterApply={() => { }} filterOptions={[]} filterWithOptionsWithDropdown={[]} />
        <AutoResizingGrid minWidth={350} gap={32}>
          <ApplicationCard />
          <ApplicationCard type="guest" />
        </AutoResizingGrid>
      </div>
    </div>
  );
};

export default Applications;
