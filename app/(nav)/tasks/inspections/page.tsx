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
import Image from "next/image";

const InspectionPage = () => {
  const { isSmallTablet } = useWindowWidth();

  return (
    <div className="space-y-7">
      {!isSmallTablet && (
        <AutoResizingGrid minWidth={280}>
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
        <div className="flex items-center space-x-4 flex-wrap">
          <SearchInput placeholder="Search for Inspection" />

          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <Modal>
              <ModalTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer">
                  <Image
                    src="/icons/sliders.svg"
                    alt="filters"
                    width={20}
                    height={20}
                  />
                  <p>Filters</p>
                </div>
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
      </div>
      <AutoResizingGrid minWidth={560} gap={32}>
        <InspectionCard type="physical" />
        <InspectionCard type="virtual" />
      </AutoResizingGrid>
      <Pagination
        totalPages={5}
        currentPage={1}
        onPageChange={function (page: number): void {
          throw new Error("Function not implemented.");
        }}
      />
    </div>
  );
};

export default InspectionPage;
