"use client";
import ImageSlider from "@/components/ImageSlider/image-slider";
import PropertyTag from "@/components/Tags/property-tag";
import { useState, useRef } from "react";
import Button from "@/components/Form/Button/button";
import { motion, AnimatePresence } from "framer-motion";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";
import { LocationIcon, CameraIcon, VideoIcon } from "@/public/icons/icons";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { empty } from "@/app/config";
import Link from "next/link";

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
}

const VehicleCard: React.FC<PropertyCardProps> = ({
  id = 12133,
  images,
  property_name = 'Property Name',
  total_units = 20,
  address = '12, kola sanusi street, mabolaje oyo',
  total_unit_pictures = 10,
  hasVideo = true,
  property_type = 'rental',
  total_returns = 20000,
  total_income = 40000,
  branch = 'Branch Name',
  accountOfficer = "Officer muba",
  last_updated = '27/11/2023',
  mobile_tenants = 2,
  web_tenants = 2,
  owing_units = 3,
  available_units = 34,
  currency = 'naira',
  isClickable = 0,
  viewOnly = 0,
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
      <ImageSlider
        images={["/empty/sampleProperty.jpeg", "/empty/sampleProperty2.jpeg"]}
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
      
      <Link href={`/management/vehicles-record/${id}`}>
      <div
        className="relative rounded-b-2xl p-4"
        role={isClickable && !viewOnly ? "button" : undefined}
        onClick={
          isClickable && !viewOnly ? () => setIsModalActive(true) : undefined
        }
      >
        <p className="text-brand-5 text-xs lg:text-sm font-bold">ID: {id} </p>
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
        <div className="flex flex-wrap justify-between items-center mt-1">
            <p className="text-black text-xs lg:text-sm font-normal"> Total Vehicles Record </p>
            <h3 className="text-brand-9 text-xl lg:text-2xl font-bold"> 456 </h3>
        </div>
      </div>
      </Link>
    </div>
  );
};

export default VehicleCard;
