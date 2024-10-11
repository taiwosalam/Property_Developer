"use client";
import Pagination from "@/components/Pagination/pagination";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import FilterButton from "@/components/FilterButton/filter-button";
import SearchInput from "@/components/SearchInput/search-input";
import VisitorRequestCard from "@/components/tasks/CallBack/RequestCard";
import { VisitorRequestData, type VisitorRequestDataDataType } from "./data";
import { type VisitorRequestCardProps } from "@/components/tasks/CallBack/types";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import FilterBar from "@/components/FIlterBar/FilterBar";

const transformToVisitorRequestCardProps = (
  data: VisitorRequestDataDataType
): VisitorRequestCardProps => {
  return {
    cardType: "visitor",
    cardViewDetails: [
      { label: "Name of Visitor", accessor: "visitorName" },
      { label: "Visotor Phone no", accessor: "visitorPhoneNumber" },
      { label: "Secret Question", accessor: "secretQuestion" },
      { label: "Purpose", accessor: "purpose" },
      { label: "Property Name", accessor: "propertyName" },
      { label: "Branch", accessor: "branch" },
    ],
    ...data,
  };
};

const BookVisitorsPage = () => {
  return (
    <section className="space-y-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          total={12}
          title="Total Visitors"
          newData={12}
        />
        <ManagementStatistcsCard total={12} title="Completed" newData={12} />
        <ManagementStatistcsCard total={12} title="Pending" newData={12} />
      </div>
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Book for Visitation" aboutPageModalData={
        { title: "Book for Visitation", description: "This page contains a list of Book for Visitation on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={[]} />
      <AutoResizingGrid gap={28} minWidth={400}>
        {VisitorRequestData.map((details, index) => (
          <VisitorRequestCard
            key={index}
            {...transformToVisitorRequestCardProps(details)}
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

export default BookVisitorsPage;
