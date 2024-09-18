import React from "react";

// Types
import type { PropertyListingCardProps } from "./types";

// Images
import { CameraIcon, VideoIcon } from "@/public/icons/icons";
import SampleProperty6 from "@/public/empty/SampleProperty6.jpg";

// Imports
import { property_listing_data } from "./data";
import Picture from "@/components/Picture/picture";
import KeyValueList from "@/components/KeyValueList/key-value-list";
import { SectionSeparator } from "@/components/Section/section-components";

const PropertyListingCard: React.FC<PropertyListingCardProps> = ({ data }) => {
  return (
    <div
      className="p-6 rounded-2xl bg-white custom-flex-col gap-4"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
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
      <div className="flex gap-6 justify-between">
        
      </div>
    </div>
  );
};

export default PropertyListingCard;
