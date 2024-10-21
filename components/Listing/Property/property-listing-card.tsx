"use client";

import React from "react";

// Types
import type { PropertyListingCardProps } from "./types";
import type { ButtonProps } from "@/components/Form/Button/types";

// Images
import { CameraIcon, VideoIcon } from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import Picture from "@/components/Picture/picture";
import Button from "@/components/Form/Button/button";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { property_listing_data, property_listing_status } from "./data";
import { SectionSeparator } from "@/components/Section/section-components";

import {
  PropertyListingRed,
  PropertyListingLabelID,
  PropertyListingParagraph,
  PropertyListingTitleDesc,
} from "./property-listing-component";

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({
  data,
  status,
  propertyType,
}) => {
  const button_props: ButtonProps = {
    size: "sm_medium",
    className: "py-2 px-8",
  };

  const color = property_listing_status[status];

  return (
    <div
      className="p-6 pb-0 rounded-2xl bg-white custom-flex-col gap-4"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex items-center gap-6 justify-between">
        <PropertyListingLabelID id="123456776342" type={propertyType} />
        <div
          className="w-5 h-5 rounded-full"
          style={{ backgroundColor: color || "#ebeef0" }}
        ></div>
      </div>
      <SectionSeparator />
      <div className="pb-6 overflow-x-auto custom-round-scrollbar">
        <div className="min-w-[800px] custom-flex-col gap-4">
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
          <div className="flex items-center gap-[10%] justify-between">
            <div className="custom-flex-col flex-1">
              {status === "draft" ? (
                <PropertyListingParagraph>
                  Property creation is not yet complete.
                </PropertyListingParagraph>
              ) : status === "awaiting" || status === "unpublished" ? (
                <PropertyListingParagraph>
                  Created By : Ajadi David -- Moniya Branch
                </PropertyListingParagraph>
              ) : status === "moderation" ? (
                <PropertyListingRed>
                  Please review the property settings and replace the picture,
                  as it appears to have been mistakenly used for another
                  property.
                </PropertyListingRed>
              ) : status === "request" ? (
                <PropertyListingTitleDesc
                  title="Taiwo Salam & Co. Properties Ltd"
                  desc="Requests permission to add and manage this property in their portfolio."
                />
              ) : null}
            </div>
            <div className="flex gap-3 items-center">
              {status === "draft" || status === "awaiting" ? (
                <Button {...button_props}>continue</Button>
              ) : status === "unpublished" ? (
                <>
                  <Button variant="border" {...button_props}>
                    manage
                  </Button>
                  <Button {...button_props}>publish</Button>
                </>
              ) : status === "moderation" ? (
                <Button variant="border" {...button_props}>
                  manage
                </Button>
              ) : status === "request" ? (
                <>
                  <Button {...button_props}>action</Button>
                  <Button variant="border" {...button_props}>
                    preview
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingCard;
