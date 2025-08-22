// Types
import type { StaffProfilePortfolioItemProps } from "./types";

// Images
import { LocationIcon } from "@/public/icons/icons";

// Imports
import Picture from "@/components/Picture/picture";
import BadgeIcon from "@/components/BadgeIcon/badge-icon";
import { secondaryFont } from "@/utils/fonts";
import { truncateText } from "@/components/tasks/vehicles-record/data";

const StaffProfilePortfolioItem: React.FC<StaffProfilePortfolioItemProps> = ({
  user,
  image,
  property,
}) => {
  return (
    <div className="flex-shrink-0 p-[18px] rounded-lg bg-white dark:bg-[#020617] min-w-[400px] flex items-center gap-4">
      <Picture src={image} alt="preview" size={60} className="rounded-[4px] custom-secondary-bg" />
      <div className="custom-flex-col gap-2">
        {property ? (
          <>
            <div className="custom-flex-col text-black dark:text-white">
              <p className="text-gray-700 dark:text-darkText-1 text-base font-medium capitalize">
                {truncateText(property.name, 30)}
              </p>
              <div className="flex gap-1 items-center text-text-disabled">
                <LocationIcon />
                <p className="text-sm font-medium">
                  {truncateText(property.location, 30)}
                </p>
              </div>
            </div>
          </>
        ) : user ? (
          <>
            <div className="custom-flex-col text-black dark:text-white">
              <div className="flex items-center gap-2">
                <p className="text-base font-bold capitalize">{user.name} </p>
                {user?.badge_color && <BadgeIcon color={user.badge_color} />}
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
