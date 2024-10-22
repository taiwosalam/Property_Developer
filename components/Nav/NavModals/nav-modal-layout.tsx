import React from "react";

// Types
import { NavModalLayoutProps } from "../types";

// Images
import CloseCircle from "@/public/icons/close-circle.svg";

// Imports
import Picture from "../../Picture/picture";
import { ModalTrigger } from "@/components/Modal/modal";

const NavModalLayout: React.FC<NavModalLayoutProps> = ({ title, children }) => {
  return (
    <div
      className="w-full max-w-[786px] rounded-2xl bg-white p-6"
      style={{ boxShadow: "2px 2px 4px 0px rgba(0, 0, 0, 0.05" }}
    >
      <div className="w-full custom-flex-col gap-12">
        <div
          className="flex items-center justify-between"
          style={{ borderBottom: "1px solid #B8B8B8" }}
        >
          <h2 className="text-primary-navy text-xl font-bold capitalize">
            {title}
          </h2>
          <ModalTrigger close>
            <Picture src={CloseCircle} alt="close" size={34} />
          </ModalTrigger>
        </div>
        {children}
      </div>
    </div>
  );
};

export default NavModalLayout;
