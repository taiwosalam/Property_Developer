import React from "react";

// Images
import Verified from "@/public/icons/verified.svg";

// Imports
import SVG from "../SVG/svg";
import Picture from "../Picture/picture";

const NavGlobalSearchItem = () => {
  return (
    <div
      className="py-2 px-4 rounded-md flex justify-between"
      style={{ boxShadow: "0px 2px 4px 0px rgba(0, 0, 0, 0.03)" }}
    >
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-[60px] h-[60px] rounded-lg bg-[#dbeafe80] flex items-center justify-center">
            <SVG type="people" color="#0033C4" className="w-[30px] h-[30px]" />
          </div>
          <div className="custom-flex-col gap-1 font-medium">
            <div className="flex items-center gap-2">
              <p className="text-black dark:text-white text-base capitalize">Bimbo David</p>
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
