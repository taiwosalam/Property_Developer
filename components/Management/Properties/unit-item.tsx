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
import { actions } from "../Rent And Unit/data";
import { ActionButton } from "../Rent And Unit/action-button";

export interface UnitItemProps {
  propertyType: string;
  // propertyType: "rental" | "facility";
  unitId: string;
  unitImages: string[];
  unitDetails: string;
  unitStatus: keyof typeof UnitStatusColors;
  unitName: string;
  rent: string;
  serviceCharge?: string;
  cautionDeposit?: string;
  tenantName?: string;
  title?: string;
  tenantBadgeColor?: BadgeIconColors;
  dueDate?: string;
  note?: boolean;
  totalPackage?: string;
  unitType?: string;
  invoice_status?: string;
  invoice_id?: number;
  partial_pending?: boolean;
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
  totalPackage,
  unitType,
  invoice_status,
  invoice_id,
  partial_pending,
}) => {
  const [screenModal, setScreenModal] = useState(false);
  const isRental = propertyType.toLowerCase() === "rental"

  const startRentBtnText = isRental
    ? "Add Tenant"
    : "Assign Occupant";
  const pendingPart =
    partial_pending || invoice_status?.trim().toLowerCase() === "pending";
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
            <p className="text-black dark:text-darkText-1 capitalize">
              {unitDetails}
            </p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Rent</p>
            <p className="text-black dark:text-darkText-1">{rent}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Unit No/Name</p>
            <p className="text-black dark:text-darkText-1 capitalize">
              {unitName}
            </p>
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
          {unitType && (
            <div>
              <p className="text-[#747474] dark:text-white">Unit Type</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {unitType}
              </p>
            </div>
          )}
          {totalPackage && (
            <div>
              <p className="text-[#747474] dark:text-white">Total Package</p>
              <p className="text-black dark:text-darkText-1 capitalize">
                {totalPackage}
              </p>
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
      <div className="flex justify-between gap-2">
        <div className="flex items-center gap-2">
          <PropertyTag
            list
            propertyType={propertyType as "facility" | "rental"}
          />
        </div>
        <div className="flex items-center justify-end my-5 gap-2 px-2 flex-wrap">
          {actions
            // First: skip all other logic if invoice_status is not 'pending' but action is "Pending"
            .filter((action) => {
              const label =
                typeof action.label === "function"
                  ? action.label(propertyType as "rental" | "facility")
                  : action.label;

              // Only allow Pending button if invoice_status is "pending"
              if (label === "Pending") {
                return invoice_status?.trim().toLowerCase() === "pending";
              }

              // Hide all other buttons if invoice_status is "pending"
              if (invoice_status?.trim().toLowerCase() === "pending") {
                return false;
              }

              // Define button visibility based on status
              if (unitStatus === "vacant" || unitStatus === "relocate") {
                return label === "Start Rent" || label === "Move In";
              }
              if (unitStatus === "occupied") {
                return (
                  label !== "Start Rent" &&
                  label !== "Move In" &&
                  label !== "Renew Rent" &&
                  label !== "Renew Fee"
                );
              }
              if (unitStatus === "expired") {
                return (
                  label === "Renew Rent" ||
                  label === "Renew Fee" ||
                  label === "Move Out" ||
                  label === "Relocate"
                );
              }
              return false;
            })

            // Then filter based on propertyType logic
            .filter((action) => {
              const label =
                typeof action.label === "function"
                  ? action.label(propertyType as "rental" | "facility")
                  : action.label;

              if (propertyType === "rental" && label === "Relocate")
                return false;
              if (propertyType === "facility" && label === "Move Out")
                return false;

              return true;
            })

            // Finally render the buttons
            .map((action, i) => (
              <ActionButton
                unit_id={unitId}
                invoice_id={Number(invoice_id) ?? 0}
                key={i}
                propertyType={propertyType as "rental" | "facility"}
                {...action}
                startText={startRentBtnText}
                route={
                  typeof action.route === "function"
                    ? action.route(unitId, propertyType as "rental" | "facility")
                    : action.route
                }
                label={
                  typeof action.label === "function"
                    ? action.label(propertyType as "rental" | "facility")
                    : action.label
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default UnitItem;
