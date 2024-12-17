"use client";

import React, { useState } from "react";

// Imports
import PropertyListingCard from "@/components/Listing/Property/property-listing-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { property_listing_status } from "@/components/Listing/Property/data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";
import FilterBar from "@/components/FIlterBar/FilterBar";
import { listingPropertyFilter } from "./data";

const Property = () => {
  const [pageData, setPageData] = useState<any>({});

  const initData = {
    property_name: "",
    annual_returns: "",
    annual_income: "",
    branch: "",
    address: "",
    last_updated: "",
  }
  
  return (
    <div className="custom-flex-col gap-9">
      <div className="hidden md:flex gap-5 flex-wrap">
        <ManagementStatistcsCard
          title="Total Property"
          newData={34}
          total={657}
          className="w-[240px]"
          colorScheme={1}
        />
        <ManagementStatistcsCard
          title="Drafted"
          newData={34}
          total={657}
          className="w-[240px]"
          colorScheme={2}
        />
        <ManagementStatistcsCard
          title="Request"
          newData={34}
          total={657}
          className="w-[240px]"
          colorScheme={3}
        />
      </div>
      <FilterBar
        azFilter
        pageTitle="Property Draft & Request"
        aboutPageModalData={{
          title: "Moderating Property",
          description:
            "This page contains a list of Moderating Property on the platform.",
          video: "",
        }}
        searchInputPlaceholder="Search"
        handleFilterApply={() => {}}
        isDateTrue={false}
        filterOptionsMenu={listingPropertyFilter}
        hasGridListToggle={false}
      />
      <div className="custom-flex-col gap-8">
        <div className="flex flex-wrap gap-4 justify-end">
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
          status="draft"
          propertyType="rental property"
        />
      </div>
    </div>
  );
};

export default Property;
