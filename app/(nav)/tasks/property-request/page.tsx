"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import PageTitle from "@/components/PageTitle/page-title";
import FilterButton from "@/components/FilterButton/filter-button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import SearchInput from "@/components/SearchInput/search-input";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import { PropertyRequestData, type PropertyRequestDataType } from "./data";
import { type PropertyRequestCardProps } from "@/components/tasks/CallBack/types";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterBar from "@/components/FIlterBar/FilterBar";

const transformToPropertyRequestCardProps = (
  data: PropertyRequestDataType
): PropertyRequestCardProps => {
  return {
    cardType: "property",
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
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Property Request"
          newData={34}
          total={657}
          className="w-[unset]"
          colorScheme={1}
        />
      </div>
      <FilterBar
        azFilter
        onStateSelect={() => {}}
        pageTitle="Request"
        aboutPageModalData={{
          title: "Request",
          description: "This page contains a list of Request on the platform.",
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
    </div>
  );
};

export default PropertyRequest;
