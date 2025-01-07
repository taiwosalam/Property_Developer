"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  getAllCallbackRequests,
  inquiriesFilterOptionsWithDropdown,
  RequestCallBackCardData as MockData,
  type RequestCallBackCardDataType,
} from "@/app/(nav)/tasks/inquires/data";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import RequestCallBackCard from "@/components/tasks/CallBack/RequestCard";
import type { CallRequestCardProps } from "@/components/tasks/CallBack/types";
import { useEffect, useState } from "react";
import FilterBar from "@/components/FIlterBar/FilterBar";
import BackButton from "@/components/BackButton/back-button";
import { LocationIcon } from "@/public/icons/icons";
// import { RequestCallBackCardDataType } from "@/app/(nav)/tasks/inquires/data";

const transformToCallBackRequestCardProps = (
  data: RequestCallBackCardDataType
): CallRequestCardProps => {
  return {
    cardType: "callback",
    cardViewDetails: [
      { label: "Phone Number", accessor: "phoneNumber" },
      { label: "Branch", accessor: "branch" },
      { label: "Property Name", accessor: "propertyName" },
      { label: "Account Officer", accessor: "accountOfficer" },
      { label: "Property Address", accessor: "propertyAddress" },
    ],
    ...data,
  };
};

const BranchInquires = () => {
  const [requestCallBackCardData, setRequestCallBackCardData] = useState<
    RequestCallBackCardDataType[]
  >([]);

  useEffect(() => {
    // getAllCallbackRequests;
  }, []);

  return (
    <section className="space-y-9">
      <div className="w-full gap-2 flex items-center justify-between flex-wrap">
        <BackButton reducePaddingTop as="div" className="items-start">
          <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-black dark:text-white">
            branchData.branch_name
          </h1>
          <div className="text-text-disabled flex items-center space-x-1">
            <LocationIcon />
            <p className="text-sm font-medium">branchData.address</p>
          </div>
        </BackButton>
            </div>
      <FilterBar
        azFilter
        pageTitle="Request Callback"
        aboutPageModalData={{
          title: "Request Callback",
          description:
            "This page contains a list of Request Callback on the platform.",
        }}
        searchInputPlaceholder="Search Call Request"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={inquiriesFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
      <AutoResizingGrid gap={28} minWidth={400}>
        {MockData.map((userDetails, index) => (
          <RequestCallBackCard
            key={index}
            {...transformToCallBackRequestCardProps(userDetails)}
          />
        ))}
      </AutoResizingGrid>
      <Pagination
        totalPages={5}
        currentPage={1}
        onPageChange={() => alert("Function not implemented.")}
      />
    </section>
  );
};

export default BranchInquires;
