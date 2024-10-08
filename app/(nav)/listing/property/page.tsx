"use client";

import React from "react";
import Image from "next/image";

// Imports
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import AutoResizingGrid from "@/components/AutoResizingGrid/AutoResizingGrid";
import PropertyListingCard from "@/components/Listing/Property/property-listing-card";
import ManagementStatistcsCard from "@/components/Management/ManagementStatistcsCard";
import { property_listing_status } from "@/components/Listing/Property/data";
import { PropertyListingStatusItem } from "@/components/Listing/Property/property-listing-component";

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
      <div className="page-title-container">
        <PageTitle title="Moderating property" />
        <div className="flex items-center gap-4">
          <SearchInput placeholder="Search for Staff and Branch" />
          <div className="bg-white rounded-lg p-2 flex items-center space-x-2">
            <button>
              <div className="flex items-center gap-2 cursor-pointer">
                <Image
                  src="/icons/sliders.svg"
                  alt="filters"
                  width={20}
                  height={20}
                />
                <p className="text-[#344054] text-base font-medium">Filters</p>
              </div>
            </button>
          </div>
        </div>
      </div>
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
