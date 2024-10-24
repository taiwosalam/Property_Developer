import React from "react";

// Types
import { NavGlobalSearchItemProps } from "./types";

// Images
import Verified from "@/public/icons/verified.svg";

// Imports
import SVG from "../SVG/svg";
import Picture from "../Picture/picture";
import { useThemeStoreSelectors } from "@/store/themeStore";

const NavGlobalSearchItem: React.FC<NavGlobalSearchItemProps> = ({ icon }) => {
  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  return (
    <div
      className="py-2 px-4 rounded-md flex justify-between"
      style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.03)" }}
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[60px] h-[60px] rounded-lg custom-secondary-bg flex items-center justify-center">
            <SVG
              type={icon}
              color={primaryColor || "#0033C4"}
              className="w-[30px] h-[30px]"
            />
          </div>
          <div className="custom-flex-col gap-1 font-medium">
            <div className="flex items-center gap-2">
              <p className="text-black dark:text-white text-base capitalize">
                Bimbo David
              </p>
              <Picture src={Verified} alt="verified" size={16} />
            </div>
            <p className="text-text-tertiary text-sm">ID: 123456789</p>
          </div>
        </div>
        <p className="text-text-tertiary text-base font-medium capitalize">
          Landlord / Landlady
        </p>
      </div>
    </div>
  );
};

export default NavGlobalSearchItem;
