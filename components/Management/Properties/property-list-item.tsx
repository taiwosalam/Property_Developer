"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/Form/Button/button";
import PopupImageModal from "@/components/PopupSlider/PopupSlider";
import { VideoIcon, CameraIcon } from "@/public/icons/icons";
import { formatNumber, currencySymbols } from "@/utils/number-formatter";
import PropertyTag from "@/components/Tags/property-tag";
import { empty } from "@/app/config";
import { useRole } from "@/hooks/roleContext";

interface PropertyListItemProps {
  id: string;
  images: string[];
  property_name: string;
  total_units: number;
  address: string;
  available_units?: number;
  owing_units?: number;
  mobile_tenants?: number;
  web_tenants?: number;
  accountOfficer?: string;
  last_updated?: string;
  total_returns: number;
  total_income: number;
  currency?: keyof typeof currencySymbols;
  branch?: string;
  property_type: "rental" | "facility";
  total_unit_pictures: number | null;
  hasVideo: boolean;
}

const PropertyListItem: React.FC<PropertyListItemProps> = ({
  id,
  images,
  property_name,
  total_units,
  address,
  available_units,
  owing_units,
  mobile_tenants,
  web_tenants,
  accountOfficer,
  last_updated,
  total_returns,
  total_income,
  currency,
  branch,
  property_type,
  total_unit_pictures,
  hasVideo,
}) => {
  const [screenModal, setScreenModal] = useState(false);
  const isRental = property_type === "rental";
  const { role } = useRole();
  // const symbol =
  //   isRental && currency ? currencySymbols[currency] : currencySymbols.naira;
  const symbol = currency ? currencySymbols[currency] : currencySymbols.naira;

  const baseRoute =
    role === "manager"
      ? "/manager/management"
      : role === "account"
      ? "/accountant/management"
      : "/management";

  const getRoute = (action: "edit" | "preview") => {
    switch (action) {
      case "edit":
        return `${baseRoute}/properties/${id}/edit-property`;
      case "preview":
        return `${baseRoute}/properties/${id}`;
      default:
        return "#";
    }
  };

  return (
    <div
      className="p-6 rounded-2xl bg-white dark:bg-darkText-primary"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05)" }}
    >
      {/* Image Modal */}
      <PopupImageModal
        isOpen={screenModal}
        onClose={() => setScreenModal(false)}
        images={images.map((image) => ({
          src: image,
        }))}
      />
      <div className="flex items-center gap-4 justify-between overflow-y-auto custom-round-scrollbar">
        <div className="flex-grow-1 flex-shrink-0 text-sm md:text-base grid grid-cols-2 gap-x-2 gap-y-4 lg:[&>div]:grid lg:[&>div]:gap-x-2 lg:[&>div]:grid-cols-[170px,1fr] xl:max-w-[calc(100%-220px-16px)] w-fit">
          <div>
            <p className="text-[#747474] dark:text-white">Last Updated</p>
            <p className="text-black dark:text-darkText-2">{last_updated}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Total Returns</p>
            <p className="text-brand-primary font-bold dark:text-brand-9">
              {symbol}
              {formatNumber(total_returns)}
            </p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Total Units</p>
            <p className="text-black dark:text-darkText-2">
              {total_units} Unit{total_units > 1 ? "s" : ""}
            </p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Total Income</p>
            <p className="text-highlight font-bold dark:text-highlight">
              {symbol}
              {formatNumber(total_income)}
            </p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">
              {`${isRental ? "Available" : "Owing"}`} Units
            </p>
            <p className="text-black dark:text-darkText-2">
              {isRental ? available_units : owing_units}
            </p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Branch</p>
            <p className="text-black dark:text-darkText-2">{branch}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">
              {isRental ? "Mobile Tenants" : "Mobile Occupants"}
            </p>
            <p className="text-black dark:text-darkText-2">{mobile_tenants}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Account Officer</p>
            <p className="text-black dark:text-darkText-2 truncate">{accountOfficer}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">
              {isRental ? "Web Tenants" : "Web Occupants"}
            </p>
            <p className="text-black dark:text-darkText-2">{web_tenants}</p>
          </div>
          <div>
            <p className="text-[#747474] dark:text-white">Address</p>
            <p className="text-black dark:text-darkText-2 truncate ellipsis">{address}</p>
          </div>
        </div>

        <div className="w-[220px] h-[220px] rounded-2xl relative overflow-hidden group cursor-pointer flex-shrink-0">
          <div
            role="button"
            className="absolute z-[10] inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
            onClick={() => setScreenModal(true)}
          >
            {/* Gropu of icons down */}
            <div className="flex items-stretch gap-[10px] absolute z-[1] left-[35%] bottom-4">
              {total_unit_pictures && (
                <div className="bg-brand-1 rounded py-1 px-1.5 flex items-center gap-1.5">
                  <CameraIcon />
                  <p className="text-black font-medium text-[10px]">
                    +{total_unit_pictures}
                  </p>
                </div>
              )}
              {hasVideo && (
                <div className="bg-brand-1 rounded py-1 px-1.5 grid place-items-center">
                  <VideoIcon />
                </div>
              )}
            </div>
          </div>
          <Image
            src={images[0] ?? empty}
            alt={property_name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      <hr className="my-4" />
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <PropertyTag propertyType={property_type} list />
          <p className="font-bold text-sm md:text-base text-brand-10">
            ID: {id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="mid"
            className="!py-[5px] !px-5 md:!py-[8px] md:!px-8 !font-bold !bg-white !border-2 !border-brand-9 !text-brand-9 hover:opacity-70"
            href={getRoute("edit")}
          >
            Manage
          </Button>
          <Button
            type="button"
            size="mid"
            className="!py-[5px] !px-5 md:!py-[8px] md:!px-8 !font-bold"
            href={getRoute("preview")}
          >
            Preview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyListItem;
