"use client";

import FilterButton from "@/components/FilterButton/filter-button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import {
  getAllCallbackRequests,
  inquiriesFilterOptionsWithDropdown,
  // RequestCallBackCardData,
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
  const [requestCallBackCardData, setRequestCallBackCardData] = useState<RequestCallBackCardDataType[]>([]);
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
    fetchRequestData();
  }, [accessToken]);

  return (
    <section className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          total={12}
          title="Total Request"
          newData={12}
        />
        <ManagementStatistcsCard
          total={12}
          title="Total Resolved"
          newData={12}
        />
        <ManagementStatistcsCard
          total={12}
          title="Total Unresolved"
          newData={12}
        />
      </div>
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Request Callback" aboutPageModalData={
        { title: "Request Callback", description: "This page contains a list of Request Callback on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={[]} />
      <AutoResizingGrid gap={28} minWidth={400}>
        {requestCallBackCardData.map((userDetails, index) => (
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
