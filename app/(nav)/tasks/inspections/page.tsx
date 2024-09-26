"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import Pagination from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import InspectionCard from "@/components/tasks/Inspections/inspection-card";
import useWindowWidth from "@/hooks/useWindowWidth";
import FilterButton from "@/components/FilterButton/filter-button";

const InspectionPage = () => {
  const { isSmallTablet } = useWindowWidth();

  return (
    <div className="space-y-7">
      {!isSmallTablet && (
        <AutoResizingGrid>
          <ManagementStatistcsCard
            title="Total Inspections"
            newData={34}
            total={657}
          />
          <ManagementStatistcsCard
            title="Physical Inspections"
            newData={34}
            total={657}
          />
          <ManagementStatistcsCard
            title="Virtual Inspections"
            newData={34}
            total={657}
          />
        </AutoResizingGrid>
      )}
      <div className="page-title-container">
        <PageTitle title="Inspection" />
        <div className="flex items-center gap-4 flex-wrap">
          <SearchInput placeholder="Search for Inspection" />
          <Modal>
            <ModalTrigger asChild>
              <FilterButton />
            </ModalTrigger>
            <ModalContent>
              <FilterModal
                filterOptionsWithDropdown={[]}
                filterOptions={[]}
                onApply={() => {}}
                date
                //   onStateSelect={(state: string) => setSelectedState(state)}
              />
            </ModalContent>
          </Modal>
        </div>
      </div>
      <AutoResizingGrid minWidth={505} gap={32}>
        <InspectionCard type="physical" />
        <InspectionCard type="virtual" />
      </AutoResizingGrid>
      <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
    </div>
  );
};

export default InspectionPage;
