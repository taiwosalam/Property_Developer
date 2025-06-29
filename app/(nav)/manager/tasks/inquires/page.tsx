"use client";

import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import {
  getAllCallbackRequests,
  inquiriesFilterOptionsWithDropdown,
  RequestCallBackCardData as MockData,
  type RequestCallBackCardDataType,
} from "./data";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import RequestCallBackCard from "@/components/tasks/CallBack/RequestCard";
import type { CallRequestCardProps } from "@/components/tasks/CallBack/types";
import { useEffect, useState } from "react";
import FilterBar from "@/components/FIlterBar/FilterBar";

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
    unitName: data.unitName ?? "", // Ensure unitName is always present
    ...data,
  };
};

const Inquires = () => {
  const [requestCallBackCardData, setRequestCallBackCardData] = useState<
    RequestCallBackCardDataType[]
  >([]);

  useEffect(() => {
    // getAllCallbackRequests;
  }, []);

  return (
    <section className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          total={12}
          title="Total Request"
          newData={12}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          total={12}
          title="Total Resolved"
          newData={12}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          total={12}
          title="Total Unresolved"
          newData={12}
          colorScheme={3}
        />
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

export default Inquires;
