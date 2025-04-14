"use client";
import { useState } from "react";
import Image from "next/image";
import { CameraIcon } from "lucide-react";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import { formatNumber } from "@/utils/number-formatter";
import PropertyTag from "@/components/Tags/property-tag";
import { StatusDots } from "./status-dot";
import { ActionButton } from "./action-button";
import { actions } from "./data";
import { RentalPropertyCardProps } from "@/app/(nav)/management/rent-unit/data";
import Link from "next/link";
import { empty } from "@/app/config";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";

const RentalPropertyListCard: React.FC<RentalPropertyCardProps> = ({
  propertyType,
  images,
  unitId,
  unit_title,
  unit_name,
  unit_type,
  tenant_name,
  expiry_date,
  rent,
  caution_deposit,
  service_charge,
  status,
  badge_color,
  tenant_id,
}) => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div
      className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <PopupImageModal
        isOpen={isOpened}
        onClose={() => setIsOpened(false)}
        images={images.map((image) => ({ src: image, isVideo: false }))}
      />

      {/* Unit ID and Status */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-bold text-brand-10 dark:text-darkText-1">
          Unit ID: {unitId}
        </span>
        <div className="flex items-center gap-1 flex-wrap">
          <StatusDots status={status} propertyType={propertyType} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-between gap-8">
        <div className="flex-grow text-sm md:text-base grid grid-cols-2 gap-x-4 gap-y-4 w-full">
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Unit Details
            </p>
            <p className="text-black dark:text-darkText-2 flex-1">
              {unit_name} {unit_type}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">Rent</p>
            <p className="text-black dark:text-darkText-2 flex-1">
              ₦{formatNumber(Number(rent))}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Unit No/Name
            </p>
            <p className="text-black dark:text-darkText-2 flex-1">
              {unit_name}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Caution Deposit
            </p>
            <p className="text-black dark:text-darkText-2 flex-1">
              ₦{formatNumber(Number(caution_deposit))}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Unit Description
            </p>
            <p className="text-black dark:text-darkText-2 flex-1">
              {unit_title}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Service Charge
            </p>
            <p className="text-black dark:text-darkText-2 flex-1">
              ₦{formatNumber(Number(service_charge))}
            </p>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Tenants Name
            </p>
            <div className="text-black dark:text-darkText-2">
              <Link
                href={`/management/tenants/${tenant_id}/manage`}
                className="flex items-center gap-1"
              >
                <span className="font-medium text-brand-primary border-b border-black dark:border-darkText-2">
                  {tenant_name}
                </span>
                {badge_color && <BadgeIcon color={badge_color} />}
              </Link>
            </div>
          </div>
          <div className="flex flex-row items-start gap-8">
            <p className="text-[#747474] dark:text-white min-w-[120px]">
              Due Date
            </p>
            <p className="text-black dark:text-darkText-2 flex-1">
              {expiry_date}
            </p>
          </div>
        </div>

        <div className="w-[220px] h-[220px] rounded-2xl relative overflow-hidden group cursor-pointer flex-shrink-0">
          <div
            role="button"
            className="absolute z-[10] inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setIsOpened(true)}
          >
            <div className="flex items-stretch gap-[10px] absolute z-[1] left-[35%] bottom-4">
              <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                <CameraIcon width={12} height={12} />
                <p className="text-black font-medium text-[10px]">
                  +{images.length}
                </p>
              </div>
            </div>
          </div>
          <Image
            src={images[0] || empty}
            alt={unit_name}
            fill
            sizes="220px"
            className="object-cover rounded-2xl"
          />
        </div>
      </div>

      {/* Divider and Footer */}
      <hr className="my-4" />
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <PropertyTag propertyType={propertyType} list />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {actions
            .filter((action) => {
              const label =
                typeof action.label === "function"
                  ? action.label(propertyType)
                  : action.label;
              if (status === "vacant" || status === "relocate") {
                return label === "Start Rent" || label === "Start Counting";
              }
              if (status === "occupied") {
                return label !== "Start Rent" && label !== "Start Counting";
              }
              if (status === "expire") {
                return (
                  label === "Renew Rent" ||
                  label === "Renew Fee" ||
                  label === "Edit"
                );
              }
              return false;
            })
            .filter((action) => {
              const label =
                typeof action.label === "function"
                  ? action.label(propertyType)
                  : action.label;
              if (propertyType === "rental" && label === "Relocate") {
                return false;
              }
              if (propertyType === "facility" && label === "Move Out") {
                return false;
              }
              return true;
            })
            .map((action, i) => (
              <ActionButton
                key={i}
                {...action}
                route={
                  typeof action.route === "function"
                    ? action.route(unitId, propertyType)
                    : action.route
                }
                label={
                  typeof action.label === "function"
                    ? action.label(propertyType)
                    : action.label
                }
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default RentalPropertyListCard;
