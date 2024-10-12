"use client";

import React from "react";
import Image from "next/image";

// Imports
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VacantUnitCard from "@/components/Listing/Units/vacant-unit-card";
import FilterBar from "@/components/FIlterBar/FilterBar";

const Units = () => {
  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Vacant Units"
          newData={34}
          total={657}
        />
        <ManagementStatistcsCard
          title="Published Units"
          newData={34}
          total={657}
        />
        <ManagementStatistcsCard
          title="Unpublished Units"
          newData={34}
          total={657}
        />
      </div>
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Vacant Units" aboutPageModalData={
        { title: "Vacant Units", description: "This page contains a list of Vacant Units on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={[]} />
      <div className="custom-flex-col gap-5">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <VacantUnitCard key={index} />
          ))}
      </div>
    </div>
  );
};

export default Units;
