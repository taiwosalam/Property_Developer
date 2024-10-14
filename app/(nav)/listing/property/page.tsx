"use client";

import React from "react";

// Imports
import PropertyListingCard from "@/components/Listing/Property/property-listing-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { property_listing_status } from "@/components/Listing/Property/data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { listingPropertyOptionsWithRadio, lstingPropertyOptionsWithDropdown } from "./data";

const Property = () => {
  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Property"
          newData={34}
          total={657}
          className="w-[240px]"
        />
        <ManagementStatistcsCard
          title="Drafted"
          newData={34}
          total={657}
          className="w-[240px]"
        />
        <ManagementStatistcsCard
          title="Under Moderation"
          newData={34}
          total={657}
          className="w-[240px]"
        />
        <ManagementStatistcsCard
          title="Unpublished"
          newData={34}
          total={657}
          className="w-[240px]"
        />
      </div>
      <FilterBar azFilter onStateSelect={() => { }} pageTitle="Drafted Property" aboutPageModalData={
        { title: "Moderating Property", description: "This page contains a list of Moderating Property on the platform." }
      } searchInputPlaceholder="Search" handleFilterApply={() => { }} isDateTrue={false} filterOptions={[]} filterOptionsWithRadio={listingPropertyOptionsWithRadio} filterWithOptionsWithDropdown={lstingPropertyOptionsWithDropdown} />
      <div className="custom-flex-col gap-8">
        <div className="flex gap-4 justify-end">
          {Object.entries(property_listing_status).map(([key, value], idx) => (
            <PropertyListingStatusItem
              key={`${key}(${idx})`}
              text={key}
              color={value}
            />
          ))}
        </div>
        <PropertyListingCard
          data={{}}
          status="draft"
          propertyType="rental property"
        />
        <PropertyListingCard
          data={{}}
          status="request"
          propertyType="gated property"
        />
        <PropertyListingCard
          data={{}}
          status="awaiting"
          propertyType="rental property"
        />
        <PropertyListingCard
          data={{}}
          status="moderation"
          propertyType="gated property"
        />
        <PropertyListingCard
          data={{}}
          status="unpublished"
          propertyType="rental property"
        />
      </div>
    </div>
  );
};

export default Property;
