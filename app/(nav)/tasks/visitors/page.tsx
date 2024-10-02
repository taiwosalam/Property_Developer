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
      <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-3 gap-4 max-w-4xl">
        <ManagementStatistcsCard
          total={12}
          title="Total Visitors"
          newData={12}
        />
        <ManagementStatistcsCard total={12} title="Completed" newData={12} />
        <ManagementStatistcsCard total={12} title="Pending" newData={12} />
      </div>
      <div className="page-title-container">
        <PageTitle title="Book for Visitation" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search " />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>Nothing to show</ModalContent>
          </Modal>
        </div>
      </div>
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
