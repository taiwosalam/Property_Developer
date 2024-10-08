"use client";

import React from "react";
import Image from "next/image";

// Imports
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VacantUnitCard from "@/components/Listing/Units/vacant-unit-card";

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
      <div className="page-title-container">
        <PageTitle title="Vacant Units" />
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Search for Staff and Branch" />
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <button>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="/icons/sliders.svg"
                  alt="filters"
                  width={20}
                  height={20}
                />
                <p className="text-[#344054] text-base font-medium">Filters</p>
              </div>
            </button>
          </div>
        </div>
      </div>
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
