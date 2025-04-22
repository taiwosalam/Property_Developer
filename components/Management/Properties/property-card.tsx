"use client";
import ImageSlider from "@/components/ImageSlider/image-slider";
import PropertyTag from "@/components/Tags/property-tag";
import { useState, useRef } from "react";
import Button from "@/components/Form/Button/button";
import { motion, AnimatePresence } from "framer-motion";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";
import { LocationIcon, CameraIcon, VideoIcon } from "@/public/icons/icons";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export interface PropertyCardProps {
  id: string;
  images: string[];
  property_name: string;
  total_units: number;
  address: string;
  total_unit_pictures: number | null;
  hasVideo: boolean;
  property_type: "rental" | "facility";
  total_returns: number;
  total_income: number;
  branch?: string;
  accountOfficer?: string;
  last_updated?: string;
  mobile_tenants?: number;
  web_tenants?: number;
  owing_units?: number;
  available_units?: number;
  currency?: keyof typeof currencySymbols;
  isClickable?: boolean;
  viewOnly?: boolean;
  default_image?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  images,
  property_name,
  total_units,
  address,
  total_unit_pictures,
  hasVideo,
  property_type,
  total_returns,
  total_income,
  branch,
  accountOfficer,
  last_updated,
  mobile_tenants,
  web_tenants,
  owing_units,
  available_units,
  currency,
  isClickable,
  viewOnly,
  default_image,
}) => {
  const isRental = property_type === "rental";
  const symbol =
    isRental && currency ? currencySymbols[currency] : currencySymbols.naira;
  const modalRef = useRef<HTMLDivElement>(null);
  const [isModalActive, setIsModalActive] = useState(false);

  useOutsideClick(modalRef, () => {
    if (isClickable && !viewOnly) {
      setIsModalActive(false);
    }
  });
  return (
    <div
      className="rounded-2xl relative overflow-hidden bg-white dark:bg-darkText-primary "
      style={{ boxShadow: "4px 4px 10px 0px rgba(0, 0, 0, 0.05)" }}
    >
      <AnimatePresence>
        {isModalActive && isClickable && (
          <motion.div
            key="modal-buttons"
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ stiffness: 100, duration: 0.3 }}
            className="h-[45%] absolute z-[3] inset-0 flex items-center justify-center gap-x-10"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            ref={modalRef}
          >
            <Button
              size="base_bold"
              className="py-2 px-8"
              href={`/management/properties/${id}/edit-property`}
            >
              Manage
            </Button>
            <Button
              size="base_bold"
              className="py-2 px-8"
              href={`/management/properties/${id}`}
            >
              Preview
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      <ImageSlider
        default_image={default_image}
        images={images}
        showImageIndexOnHover
        className="h-[200px] rounded-t-2xl"
      >
        <div className="flex items-stretch gap-[10px] absolute z-[2] right-2 bottom-2">
          {total_unit_pictures && (
            <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 flex items-center gap-1.5">
              <CameraIcon />
              <p className="text-black dark:text-darkText-1 font-medium text-[10px]">
                +{total_unit_pictures}
              </p>
            </div>
          )}
          {hasVideo && (
            <div className="bg-brand-1 dark:bg-darkText-primary rounded py-1 px-1.5 grid place-items-center">
              <VideoIcon />
            </div>
          )}
        </div>
      </ImageSlider>

      <div
        className="relative rounded-b-2xl p-4"
        role={isClickable && !viewOnly ? "button" : undefined}
        onClick={
          isClickable && !viewOnly ? () => setIsModalActive(true) : undefined
        }
      >
        <p className="text-brand-5 text-xs lg:text-sm font-bold">ID: {id}</p>
        <p className="text-[#374151] dark:text-white text-lg md:text-xl lg:text-2xl font-bold">
          <span className="text-ellipsis line-clamp-1 break-all">
            {property_name}
          </span>
          <span className="text-ellipsis line-clamp-1 break-all">
            ({total_units} Units)
          </span>
        </p>
        <p className="flex items-center gap-1 text-brand-tertiary text-xs lg:text-sm font-normal text-ellipsis line-clamp-1 break-all">
          <LocationIcon />
          <span className="text-ellipsis line-clamp-1 break-all">
            {address}
          </span>
        </p>
        <div className="flex flex-wrap justify-between items-end mt-1">
          <PropertyTag propertyType={property_type} sm />
          <div className="text-right">
            <p className="text-brand-primary text-lg lg:text-xl font-bold">{`${symbol}${formatNumber(
              total_returns
            )}`}</p>
            <p className="text-[#606060] dark:text-darkText-1 font-normal text-xs">
              Total Returns
            </p>
            <p className="text-text-disabled font-medium text-sm">
              <span className="text-highlight">{`${symbol}${formatNumber(
                total_income
              )}`}</span>{" "}
              / Total Income
            </p>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isModalActive && isClickable && (
          <motion.div
            key="Extra Info"
            transition={{ stiffness: 100, duration: 0.3 }}
            initial={{ y: "100%" }}
            animate={{ y: "0" }}
            exit={{ y: "100%" }}
            className="bg-white dark:bg-darkText-primary px-8 pt-4 pb-10 text-xs grid grid-cols-3 gap-x-4 gap-y-2 absolute bottom-0 w-full rounded-b-2xl z-[3] cursor-default h-[55%]"
          >
            <div>
              <p className="text-label font-normal">Branch</p>
              <p className="text-brand-9 font-bold">{branch}</p>
            </div>
            <div>
              <p className="text-label font-normal">Total Units</p>
              <p className="text-brand-9 font-bold">{total_units}</p>
            </div>
            <div>
              <p className="text-label font-normal">
                Available Units
                {/* {isRental ? "Available" : "Owing"} Units */}
              </p>
              <p className="text-brand-9 font-bold">
                {available_units}
                {/* {isRental ? available_units : owing_units} */}
              </p>
            </div>
            <div>
              <p className="text-label font-normal">{ isRental ? "Mobile Tenants" : "Mobile Occupants" }</p>
              <p className="text-brand-9 font-bold">{mobile_tenants}</p>
            </div>
            <div>
              <p className="text-label font-normal">{ isRental ? "Web Tenants" : "Web Occupants" }</p>
              <p className="text-brand-9 font-bold">{web_tenants}</p>
            </div>
            <div>
              <p className="text-label font-normal">Last Updated</p>
              <p className="text-brand-9 font-bold">{last_updated}</p>
            </div>
            <div className="col-span-3">
              <p className="text-label font-normal">Account Officer</p>
              <p className="text-brand-9 font-bold truncate line-clamp-1">
                {accountOfficer}
                {/* {accountOfficer ? `${accountOfficer.substring(0, 30)}...` : ""} */}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyCard;
