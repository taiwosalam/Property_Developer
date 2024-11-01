"use client";
// Imports
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VacantUnitCard from "@/components/Listing/Units/vacant-unit-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import {
  listingUnitOptionsWithRadio,
  lstingUnitOptionsWithDropdown,
} from "./data";

const Units = () => {
  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Vacant Units"
          newData={34}
          total={657}
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Published Units"
          newData={34}
          total={657}
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Unpublished Units"
          newData={34}
          total={657}
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        onStateSelect={() => {}}
        pageTitle="Vacant Units"
        aboutPageModalData={{
          title: "Vacant Units",
          description:
            "This page contains a list of Vacant Units on the platform.",
        }}
        searchInputPlaceholder="Search for vacant units"
        handleFilterApply={() => {}}
        isDateTrue={false}
        filterOptions={[]}
        filterWithOptionsWithDropdown={lstingUnitOptionsWithDropdown}
        filterOptionsWithRadio={listingUnitOptionsWithRadio}
        hasGridListToggle={false}
      />
      <div className="custom-flex-col gap-5">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <VacantUnitCard key={index} />
          ))}
      </div>
    </div>
  );
};

export default Units;
