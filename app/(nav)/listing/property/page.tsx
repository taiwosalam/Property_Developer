"use client";

import Image from "next/image";
import React, { useState } from "react";

// Types
import type { PropertyListingType } from "@/components/Listing/Property/types";

// Imports
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import PropertyListingCard from "@/components/Listing/Property/property-listing-card";
import { property_listing_types } from "@/components/Listing/Property/data";

const Property = () => {
  const [activeProperty, setActiveProperty] = useState<PropertyListingType>(
    "moderating property"
  );

  return (
    <div className="custom-flex-col gap-9">
      <div className="page-header-container">
        <div></div>
        <div className="flex gap-3">
          {property_listing_types.map((type, index) => (
            <Button
              key={index}
              size="sm_medium"
              variant={activeProperty === type ? "default" : "border"}
              className="py-2 px-8"
            >
              {type}
            </Button>
          ))}
        </div>
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
        <PropertyListingCard data={{}} />
      </div>
    </div>
  );
};

export default Property;
