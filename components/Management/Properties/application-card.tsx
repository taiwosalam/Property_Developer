import { CameraIcon } from "lucide-react";
import React, { useState } from "react";
import Image from "next/image";
import { empty } from "@/app/config";
import { SectionSeparator } from "@/components/Section/section-components";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import { transformUnitDetails } from "@/app/(nav)/listing/data";

interface IApplicationCardUnit {
  unitId: number;
  unitName: string;
  address: string;
  propertyName: string;
  rentAmount: string;
  period: string;
  moveOutDate?: string;
  moveInDate?: string;
  propertyImages: Array<string>;
  propertyType: string;
  managedBy: string;
  prev?: boolean;
  unitData?: {
    unit_name: string;
    total_squ_area: string;
    unit_preference: string;
    unit_type: string;
    unit_sub_type: string;
    measurement: string;
    bedroom: string;
  };
}
export const ApplicationCardUnit: React.FC<IApplicationCardUnit> = ({
  unitName,
  unitId,
  address,
  propertyName,
  rentAmount,
  period,
  moveOutDate,
  moveInDate,
  propertyImages,
  propertyType,
  managedBy,
  prev,
  unitData
}) => {
  const [screenModal, setScreenModal] = useState(false);

  return (
    <>
      <div
        className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
        style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
      >
        <PopupImageModal
          isOpen={screenModal}
          onClose={() => setScreenModal(false)}
          images={propertyImages.map((image) => ({
            src: image,
          }))}
        />
        <div className="flex gap-2 justify-between items-center overflow-y-auto custom-round-scrollbar pb-2">
          <div className="min-w-[400px] flex-1 text-sm md:text-base grid grid-cols-3 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[35%,1fr]">
            <div>
              <p className="text-[#747474] dark:text-white">Unit Title</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {unitData ? transformUnitDetails(unitData) : ""}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Rent</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {rentAmount}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Full Address</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {address}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Period</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {period}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">Property Name</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {propertyName}
              </p>
            </div>

            <div>
              <p className="text-[#747474] dark:text-white">
                {prev ? "Move out Date" : "Move in Date"}
              </p>
              <p className="text-black dark:text-darkText-1">
                {prev ? moveOutDate : moveInDate}
              </p>
            </div>
          </div>

          {/* Image */}
          {propertyImages.length > 0 && (
            <div
              role="button"
              className="flex-shrink-0 w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer"
              onClick={() => setScreenModal(true)}
            >
              {propertyImages.length > 1 && (
                <div className="absolute z-[1] left-[50%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                  <CameraIcon />
                  <p className="text-black font-medium text-[10px]">+{1}</p>
                </div>
              )}
              <Image
                src={propertyImages[0] || empty}
                alt={"card"}
                fill
                className="object-cover object-center"
              />
            </div>
          )}
        </div>

        <SectionSeparator className="my-4 h-[2px]" />
        <div className="flex justify-between items-center flex-wrap ">
          <button className="property-type bg-opacity-40 text-brand-9 py-1 capitalize rounded-xl bg-brand-5 px-3 h-7 text-sm mt-1">
            {propertyType}
          </button>

          <p className="text-[#343434] dark:text-white font-semibold mt-3 sm:mt-0 capitalize">
            Rent Managed By: {managedBy}
          </p>
        </div>
      </div>
    </>
  );
};
