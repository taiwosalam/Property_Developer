"use client";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import useWindowWidth from "@/hooks/useWindowWidth";
import PageTitle from "@/components/PageTitle/page-title";
import FilterButton from "@/components/FilterButton/filter-button";
import { Modal, ModalTrigger, ModalContent } from "@/components/Modal/modal";
import SearchInput from "@/components/SearchInput/search-input";
import PropertyRequestCard from "@/components/tasks/CallBack/RequestCard";
import { PropertyRequestData, type PropertyRequestDataType } from "./data";
import { type PropertyRequestCardProps } from "@/components/tasks/CallBack/types";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";

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
  const { isSmallTablet } = useWindowWidth();

  return (
    <div className="space-y-9">
      {!isSmallTablet && (
        <div className="w-fit">
          <ManagementStatistcsCard
            title="Property Request"
            newData={34}
            total={657}
          />
        </div>
      )}
      <div className="page-title-container">
        <PageTitle title="Request" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search" />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>Hi</ModalContent>
          </Modal>
        </div>
      </div>
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
