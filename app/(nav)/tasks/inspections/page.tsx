"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import FilterModal from "@/components/Management/Landlord/filters-modal";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import PageTitle from "@/components/PageTitle/page-title";
import Pagination from "@/components/Pagination/pagination";
import SearchInput from "@/components/SearchInput/search-input";
import InspectionCard from "@/components/tasks/Inspections/inspection-card";
import FilterButton from "@/components/FilterButton/filter-button";
import FilterBar from "@/components/FIlterBar/FilterBar";

const InspectionPage = () => {
  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap">
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
      </div>
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Inspection" aboutPageModalData={
        { title: "Inspection", description: "This page contains a list of Inspection on the platform." }
      } searchInputPlaceholder="Search for Inspection" handleFilterApply={() => { }} isDateTrue filterOptions={[]} filterWithOptionsWithDropdown={[]} />
      <AutoResizingGrid minWidth={505} gap={32}>
        <InspectionCard type="physical" />
        <InspectionCard type="virtual" />
      </AutoResizingGrid>
      <Pagination totalPages={5} currentPage={1} onPageChange={() => { }} />
    </div>
  );
};

export default InspectionPage;
