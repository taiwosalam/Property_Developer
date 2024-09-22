import React from "react";

// Types
import type { StaffProfilePortfolioItemProps } from "./types";

// Images
import LocationIcon from "@/public/icons/location.svg";

// Imports
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { secondaryFont } from "@/utils/fonts";

const StaffProfilePortfolioItem: React.FC<StaffProfilePortfolioItemProps> = ({
  user,
  image,
  property,
}) => {
  return (
    <div className="p-[18px] rounded-lg bg-white flex items-center gap-2">
      <Picture src={image} alt="preview" size={60} className="rounded-[4px]" />
      <div className="custom-flex-col gap-1">
        {property ? (
          <>
            <p className="text-gray-700 text-base font-medium capitalize">
              {property.name}
            </p>
            <div className="flex gap-1">
              <Picture
                src={LocationIcon}
                alt="location"
                width={12}
                height={16}
              />
              <p className="text-text-disabled text-sm font-medium">
                {property.location}
              </p>
            </div>
          </>
        ) : user ? (
          <>
            <div className="custom-flex-col text-black">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold capitalize">{user.name}</p>
                <BadgeIcon color="black" />
              </div>
              <p className={`text-sm font-normal ${secondaryFont.className}`}>
                {user.email}
              </p>
            </div>
            <p
              className={`text-[#8D8D8D] text-sm font-semibold ${secondaryFont.className}`}
            >
              {user.phone_number}
            </p>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default StaffProfilePortfolioItem;
