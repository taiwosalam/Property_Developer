"use client";

import React from "react";
import Image from "next/image";

// Imports
import useWindowWidth from "@/hooks/useWindowWidth";
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import ExamineCard from "@/components/tasks/Examine/examine-card";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";

const Examine = () => {
  const { isSmallTablet } = useWindowWidth();

  return (
    <div className="custom-flex-col gap-8">
      <div className="page-header-container gap-6">
        {!isSmallTablet && (
          <AutoResizingGrid minWidth={280}>
            <ManagementStatistcsCard
              title="Total Examine"
              newData={34}
              total={657}
            />
          </AutoResizingGrid>
        )}
        <div className="flex items-center">
          <Button href="" className="page-header-button">
            + create new
          </Button>
        </div>
      </div>
      <div className="page-title-container">
        <PageTitle title="Examine" />
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
      <AutoResizingGrid minWidth={350} gap={32}>
        {Array(10)
          .fill(null)
          .map((_, index) => (
            <ExamineCard key={index} />
          ))}
      </AutoResizingGrid>
    </div>
  );
};

export default Examine;
