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
} from "./data";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import RequestCallBackCard from "@/components/tasks/CallBack/RequestCallBackCard";

const Inquires = () => {
  return (
    <section className="space-y-9">
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-4xl">
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
      <AutoResizingGrid gap={28} minWidth={510}>
        {RequestCallBackCardData.map((userDetails, index) => (
          <RequestCallBackCard
            userDetails={userDetails.userDetails}
            key={index}
            userName={userDetails.userName}
            requestDate={userDetails.requestDate}
            requestId={userDetails.requestId}
            status={userDetails.status}
            pictureSrc={userDetails.pictureSrc}
            phoneNumber={userDetails.phoneNumber}
            propertyName={userDetails.propertyName}
            propertyAddress={userDetails.propertyAddress}
            branch={userDetails.branch}
            accountOfficer={userDetails.accountOfficer}
            resolvedBy={userDetails.resolvedBy}
            resolvedDateTime={userDetails.resolvedDateTime}
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
