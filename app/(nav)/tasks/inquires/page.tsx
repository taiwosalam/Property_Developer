"use client";

import FilterButton from "@/components/FilterButton/filter-button";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import {
  inquiriesFilterOptionsWithDropdown,
  RequestCallBackCardData,
  type RequestCallBackCardDataType,
} from "./data";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import RequestCallBackCard from "@/components/tasks/CallBack/RequestCard";
import type { CallRequestCardProps } from "@/components/tasks/CallBack/types";

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
      <div className="page-title-container">
        <PageTitle title="Request Callback" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search " />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>
              <FilterModal
                filterOptionsWithDropdown={inquiriesFilterOptionsWithDropdown}
                filterOptions={[]}
                onApply={() => {}}
                date
                onStateSelect={() => {}}
              />
            </ModalContent>
          </Modal>
        </div>
      </div>
      <AutoResizingGrid gap={28} minWidth={400}>
        {RequestCallBackCardData.map((userDetails, index) => (
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
