"use client";

import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import Pagination from "@/components/Pagination/pagination";
import InspectionCard from "@/components/tasks/Inspections/inspection-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { inspectionFilterOptionsWithDropdown } from "./data";

const InspectionPage = () => {
  return (
    <div className="space-y-7">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Inspections"
          newData={34}
          total={657}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Physical Inspections"
          newData={34}
          total={657}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Virtual Inspections"
          newData={34}
          total={657}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Inspection"
        aboutPageModalData={{
          title: "Inspection",
          description:
            "This page contains a list of Inspection on the platform.",
        }}
        searchInputPlaceholder="Search for Inspection"
        handleFilterApply={() => {}}
        isDateTrue
        filterOptionsMenu={inspectionFilterOptionsWithDropdown}
        hasGridListToggle={false}
      />
      <AutoResizingGrid minWidth={505} gap={32}>
        <InspectionCard type="physical" />
        <InspectionCard type="virtual" />
      </AutoResizingGrid>
      <Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />
    </div>
  );
};

export default InspectionPage;
