"use client";

import React from "react";

// Types
import type { PropertyListingCardProps } from "./types";

// Images
import { CameraIcon, VideoIcon } from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import { property_listing_data } from "./data";
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";
import {
  PropertyListingLabelID,
  PropertyListingRed,
  PropertyListingTitleDesc,
} from "./property-listing-component";

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({ data }) => {
  return (
    <div
      className="p-6 rounded-2xl bg-white custom-flex-col gap-4"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex gap-6 justify-between">
        <div className="custom-flex-col gap-2">
          <PropertyListingLabelID id="123456776342" type="gated property" />
          <PropertyListingTitleDesc
            title="Taiwo Salam & Co. Properties Ltd"
            desc="Requests permission to add and manage this property in their portfolio."
          />
          <p className="text-text-secondary text-base font-medium">
            Created By : Ajadi David -- Moniya Branch
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <Button size="base_medium" className="py-2 px-8">
            continue
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            Action
          </Button>
          <Button size="base_medium" variant="border" className="py-2 px-8">
            Preview
          </Button>
        </div>
      </div>
      <SectionSeparator />
      <div className="flex items-center gap-6 justify-between">
        <div className="flex flex-1">
          <KeyValueList
            chunkSize={5}
            data={data}
            referenceObject={property_listing_data}
          />
        </div>
        <div className="relative rounded-2xl overflow-hidden">
          <Picture
            src={SampleProperty6}
            alt="property preview"
            width={220}
            height={204}
          />
          <div
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
            className="absolute inset-0 custom-flex-col justify-between p-3"
          >
            <div className="flex justify-end">
              <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon />
                <p className="text-black font-medium text-[10px]">+23</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon />
                <p className="text-black font-medium text-[10px]">2</p>
              </div>
              <div className="bg-brand-1 rounded py-1 px-1.5 gap-1.5 flex items-center">
                <VideoIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionSeparator />
      <div className="flex gap-[10%] justify-between">
        <div className="custom-flex-col gap-2">
          <PropertyListingLabelID id="123456776342" type="rental property" />
          <PropertyListingRed>
            The posted picture does not correspond to the listed property and
            unit. Please review and update accordingly, including adjusting the
            descriptions to accurately reflect the property.
          </PropertyListingRed>
        </div>
        <div className="flex gap-3 items-center">
          <Button size="base_medium" variant="border" className="py-2 px-8">
            manage
          </Button>
          <Button size="base_medium" className="py-2 px-8">
            approve
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingCard;
