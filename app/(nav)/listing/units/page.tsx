"use client";
// Imports
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import VacantUnitCard from "@/components/Listing/Units/vacant-unit-card";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { listingUnitFilter, unit_listing_status } from "./data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";

const Units = () => {
  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Units"
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
        <ManagementStatistcsCard
          title="Under Moderation"
          newData={34}
          total={657}
          className="w-[240px]"
          colorScheme={4}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Vacant Units"
        aboutPageModalData={{
          title: "Vacant Units",
          description:
            "This page contains a list of Vacant Units on the platform.",
        }}
        searchInputPlaceholder="Search for vacant units"
        handleFilterApply={() => { }}
        isDateTrue={false}
        filterOptionsMenu={listingUnitFilter}
        hasGridListToggle={false}
      />
      <div className="custom-flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-end">
          {Object.entries(unit_listing_status).map(([key, value], idx) => (
            <PropertyListingStatusItem
              key={`${key}(${idx})`}
              text={key}
              color={value}
            />
          ))}
        </div>
            <VacantUnitCard 
               status="published"
            />
            <VacantUnitCard 
               status="unpublished"
            />
            <VacantUnitCard 
               status="under moderation"
            />
            <VacantUnitCard 
               status="rejected"
            />
      </div>
    </div>
  );
};

export default Units;
