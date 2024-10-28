"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import FilterButton from "@/components/FilterButton/filter-button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import SearchInput from "@/components/SearchInput/search-input";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import { type PropertyRequestCardProps } from "@/components/tasks/CallBack/types";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { PropertyRequestData, PropertyRequestDataType } from "@/app/(nav)/tasks/property-request/data";
import Button from "@/components/Form/Button/button";
import CommunityBoardModal from "@/components/Community/modal/CommunityBoardModal";
import { AgentCommunityRequestCardProps } from "../type";
import Pagination from "@/components/Pagination/pagination";


const lists = [
  {
    title: "All Community Articles",
    desc: "Explore announcements and updates from your area or nationwide, shared by leading real estate professionals. Stay informed on the latest market insights, property matters, and real estate events to stay updated.",
    link: "/tasks/agent-community",
  },
  {
    title: "My Articles",
    desc: "Assess the Articles youve initiated, any modifications made to it, and its overall performance.",
    link: "/tasks/agent-community/my-articles",
  },
  {
    title: "My Properties Request",
    desc: "Evaluate the property request you've generated, comments received, and how you've managed them.",
    link: "/tasks/agent-community/my-properties-request",
  },
];

const transformToPropertyRequestCardProps = (
  data: PropertyRequestDataType
): AgentCommunityRequestCardProps => {
  return {
    cardType: "agent-community",
    cardViewDetails: [
      { label: "Location (State)", accessor: "state" },
      { label: "Local Government", accessor: "lga" },
      { label: "Property Type", accessor: "propertyType" },
      { label: "Category", accessor: "category" },
      { label: "Min Budget", accessor: "minBudget" },
      { label: "Max Budget", accessor: "maxBudget" },
    ],
    ...data,
  };
};

const PropertyRequest = () => {
  return (
    <div className="space-y-9">
       <div className="hidden md:flex gap-5 flex-wrap items-center justify-between">
        <ManagementStatistcsCard
          title="Total Request"
          newData={34}
          total={657}
        />
        <Modal>
            <ModalTrigger asChild>
              <Button type="button" className="page-header-button">
                + Community Board
              </Button>
            </ModalTrigger>
            <ModalContent>
                <CommunityBoardModal lists={lists} />
            </ModalContent>
          </Modal>
      </div>
      <FilterBar
        azFilter
        onStateSelect={() => {}}
        pageTitle="Property Request"
        aboutPageModalData={{
          title: "Property Request",
          description: "This page contains a list of Property Request on the platform.",
        }}
        searchInputPlaceholder="Search Property Request"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptions={[]}
        filterWithOptionsWithDropdown={[]}
        hasGridListToggle={false}
      />
      <AutoResizingGrid gap={28} minWidth={400}>
        {PropertyRequestData.map((details, index) => (
          <PropertyRequestCard
            key={index}
            {...transformToPropertyRequestCardProps(details)}
          />
        ))}
      </AutoResizingGrid>
      <div className="pagination">
        <Pagination
          totalPages={5}
          currentPage={1}
          onPageChange={() => {}}
        />
      </div>
    </div>
  );
};

export default PropertyRequest;
