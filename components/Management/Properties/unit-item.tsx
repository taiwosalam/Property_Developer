"use client";
import { useState } from "react";
import { CameraIcon } from "@/public/icons/icons";
import Image from "next/image";
import { SectionSeparator } from "@/components/Section/section-components";
import BadgeIcon, {
  type BadgeIconColors,
} from "@/components/BadgeIcon/badge-icon";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import PropertyTag from "@/components/Tags/property-tag";
import { UnitStatusColors } from "./property-preview";

export interface UnitItemProps {
  propertyType: "rental" | "facility";
  unitId: string;
  unitImages: string[];
  unitDetails: string;
  unitStatus: keyof typeof UnitStatusColors;
  unitName: string;
  rent: string;
  serviceCharge?: string;
  cautionDeposit?: string;
  tenantName?: string;
  tenantBadgeColor?: BadgeIconColors;
  dueDate?: string;
}

const UnitItem: React.FC<UnitItemProps> = ({
  propertyType,
  unitId,
  unitName,
  unitImages,
  unitStatus,
  unitDetails,
  rent,
  serviceCharge,
  tenantName,
  tenantBadgeColor,
  dueDate,
  cautionDeposit,
}) => {
  const [screenModal, setScreenModal] = useState(false);

  return (
    <div
      className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={unitImages.map((image) => ({
          src: image,
        }))}
      />
      <div className="flex items-center justify-between">
        <h4 className="text-brand-10 text-base font-bold">Unit ID: {unitId}</h4>
        <div className="flex items-center justify-between gap-2">
          <div
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: UnitStatusColors[unitStatus] }}
          />
        </div>
      </div>
      {/* <hr className="my-4 " /> */}
      <SectionSeparator className="my-4 h-[2px]" />
      <div className="flex items-center gap-2 justify-between overflow-y-auto custom-round-scrollbar pb-2">
        <div className="min-w-[400px] flex-1 text-sm md:text-base grid grid-cols-2 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[35%,1fr]">
          <div>
            <p className="text-[#747474] dark:text-white">Unit Details</p>
            <p className="text-black dark:text-darkText-1 capitalize">{unitDetails}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Rent</p>
            <p className="text-black dark:text-darkText-1">{rent}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Unit No/Name</p>
            <p className="text-black dark:text-darkText-1">{unitName}</p>
          </div>
          {cautionDeposit && (
            <div>
              <p className="text-[#747474] dark:text-white">Caution Deposit</p>
              <p className="text-black dark:text-darkText-1">
                {cautionDeposit}
              </p>
            </div>
          )}
          {serviceCharge && (
            <div>
              <p className="text-[#747474] dark:text-white">Service Charge</p>
              <p className="text-black dark:text-darkText-1">{serviceCharge}</p>
            </div>
          )}
          {tenantName && (
            <div>
              <p className="text-[#747474] dark:text-white">
                Tenant&apos;s Name
              </p>
              <p className="text-black dark:text-darkText-1 underline underline-offset-4 flex items-center">
                {tenantName}{" "}
                {tenantBadgeColor && <BadgeIcon color={tenantBadgeColor} />}
              </p>
            </div>
          )}
          {dueDate && (
            <div>
              <p className="text-[#747474] dark:text-white">Due Date</p>
              <p className="text-black dark:text-darkText-1">{dueDate}</p>
            </div>
          )}
        </div>

        {/* Image */}
        <div
          role="button"
          className="flex-shrink-0 w-[168px] h-[168px] rounded-2xl relative overflow-hidden cursor-pointer"
          onClick={() => setScreenModal(true)}
        >
          {unitImages.length > 1 && (
            <div className="absolute z-[1] left-[50%] top-3 bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
              <CameraIcon />
              <p className="text-black font-medium text-[10px]">
                +{unitImages.length - 1}
              </p>
            </div>
          )}
          <Image
            src={unitImages[0]}
            alt={unitName}
            fill
            className="object-cover object-center"
          />
        </div>
      </div>

      <SectionSeparator className="my-4 h-[2px]" />
      <PropertyTag propertyType={propertyType} />
    </div>
  );
};

export default UnitItem;
