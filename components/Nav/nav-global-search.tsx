import React from "react";

// Images
import PlaneBlue from "@/public/icons/plane-blue.svg";
import CloseCircle from "@/public/icons/close-circle.svg";

// Imports
import Input from "../Form/Input/input";
import Picture from "../Picture/picture";
import { ModalTrigger } from "../Modal/modal";
import { SectionSeparator } from "../Section/section-components";

const NavGlobalSearch = () => {
  return (
    <div
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.05)" }}
      className="custom-flex-col gap-3 py-8 bg-white rounded-2xl border border-solid border-neutral-4"
    >
      <div className="custom-flex-col px-8">
        <div className="custom-flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="custom-flex-col">
              <h2 className="text-primary-navy text-xl font-bold uppercase">
                global search
              </h2>
              <p className="text-text-disabled text-sm font-normal">
                Search for properties, units, rent, tenant/occupant, task, &
                more
              </p>
            </div>
            <ModalTrigger close className="p-2">
              <Picture src={CloseCircle} alt="close" size={34} />
            </ModalTrigger>
          </div>
          <SectionSeparator />
        </div>
        <div className="flex gap-3 items-stretch">
          <Input
            id="search"
            placeholder="Search"
            className="text-sm"
          />
          <button className="bg-brand-9 min-h-full aspect-square">lol</button>
          {/* <button className="bg-brand-9 h-full aspect-square flex justify-center items-center rounded-md">
            <Picture src={PlaneBlue} alt="send" size={24} />
          </button> */}
        </div>
      </div>
      <SectionSeparator />
    </div>
  );
};

export default NavGlobalSearch;
