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
import { useAuthStore } from "@/store/authstrore";
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
    ...data,
  };
};

const Inquires = () => {
  const [requestCallBackCardData, setRequestCallBackCardData] = useState<
    RequestCallBackCardDataType[]
  >([]);
  const accessToken = useAuthStore((state) => state.access_token);
  useEffect(() => {
    const fetchRequestData = (): void => {
      getAllCallbackRequests(accessToken)
        .then((data) => {
          setRequestCallBackCardData(data);
        })
        .catch((error) => {
          console.error("Error fetching examines:", error);
        });
    };
    // fetchRequestData();
  }, [accessToken]);

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
        onStateSelect={() => {}}
        pageTitle="Request Callback"
        aboutPageModalData={{
          title: "Request Callback",
          description:
            "This page contains a list of Request Callback on the platform.",
        }}
        searchInputPlaceholder="Search Call Request"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={inquiriesFilterOptionsWithDropdown}
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
