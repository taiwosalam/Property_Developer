"use client";

import React from "react";
import Image from "next/image";

// Imports
import Button from "@/components/Form/Button/button";
import PageTitle from "@/components/PageTitle/page-title";
import SearchInput from "@/components/SearchInput/search-input";
import PropertyListingCard from "@/components/Listing/Property/property-listing-card";

const Property = () => {
  return (
    <div className="custom-flex-col gap-9">
      <div className="page-header-container">
        <div></div>
        <div className="flex gap-3">
          <Button size="sm_medium" variant="border" className="py-2 px-8">
            moderating property
          </Button>
          <Button size="sm_medium" variant="border" className="py-2 px-8">
            drafted property
          </Button>
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
