import React from "react";

// Images
import CloseCircle from "@/public/icons/close-circle.svg";

// Imports
import Picture from "../Picture/picture";
import { ModalTrigger } from "../Modal/modal";
import NavCreateNewColumn from "./nav-create-new-column";
import { create_new_items } from "./nav-create-new-items";
import { SectionSeparator } from "../Section/section-components";

const NavCreateNew = () => {
  return (
    <div
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.05)" }}
      className="custom-flex-col gap-8 pt-3 pb-10 px-8 bg-white dark:bg-darkText-primary dark:border-[#3C3D37] rounded-2xl border border-solid border-neutral-4"
    >
      <div className="custom-flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-primary-navy dark:text-white text-xl font-bold uppercase">
            create new
          </h2>
          <ModalTrigger close className="p-2">
            <Picture src={CloseCircle} alt="close" size={34} />
          </ModalTrigger>
        </div>
        <SectionSeparator />
      </div>
      <NavCreateNewColumn data={create_new_items} />
    </div>
  );
};

export default NavCreateNew;
