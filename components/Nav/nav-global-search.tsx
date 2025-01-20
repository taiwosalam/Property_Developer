"use client";

import { useState } from "react";
import { SendMessageIcon } from "@/public/icons/icons";

// Imports
import { SVGType } from "../SVG/types";
import Input from "../Form/Input/input";
import { ModalTrigger } from "../Modal/modal";
import { NavSearchTab } from "./nav-components";
import { NavCloseIcon } from "@/public/icons/icons";
import NavGlobalSearchItem from "./nav-global-search-item";
import { SectionSeparator } from "../Section/section-components";
import Cookies from 'js-cookie'
import { getGlobalSearchTabs } from "@/app/(onboarding)/auth/data";

const NavGlobalSearch = () => {
  const role = Cookies.get("role") || "";
  const [activeTab, setActiveTab] = useState(0);
  const tabs = getGlobalSearchTabs(role) || [];

  if (!tabs.length) return null;

  return (
    <div
      style={{ boxShadow: "4px 4px 20px 2px rgba(0, 0, 0, 0.05)" }}
      className="w-[85%] max-w-[1200px] custom-flex-col gap-3 bg-white dark:bg-black rounded-2xl border border-solid border-neutral-4 dark:border-[#3C3D37] overflow-hidden max-h-[80vh]"
    >
      <div className="custom-flex-col gap-6 pt-8 px-8 bg-neutral-2 dark:bg-black border-b border-solid border-neutral-4 dark:border-[#3C3D37]">
        <div className="custom-flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="custom-flex-col">
              <h2 className="text-primary-navy dark:text-white text-xl font-bold uppercase">
                global search
              </h2>
              <p className="text-text-disabled text-sm font-normal">
                Search for properties, units, rent, tenant/occupant, task, &
                more
              </p>
            </div>
            <ModalTrigger close className="p-2">
              <NavCloseIcon />
            </ModalTrigger>
          </div>
          <SectionSeparator />
        </div>
        <div className="flex">
          <div className="flex gap-3 w-[60%] h-[45px]">
            <Input
              id="search"
              placeholder="Search"
              className="h-full flex-1 text-sm bg-neutral-3 dark:bg-black"
            />
            <button
              aria-label="search"
              className="bg-brand-9 h-full aspect-square flex justify-center items-center rounded-md"
            >
              <span className="text-white">
                <SendMessageIcon />
              </span>
            </button>
          </div>
        </div>
        <div className="w-full pb-4 overflow-x-auto custom-round-scrollbar">
          <div className="flex gap-8">
            {tabs.map(({ label }, idx) => (
              <NavSearchTab
                key={idx}
                count={0}
                active={idx === activeTab}
                onClick={() => setActiveTab(idx)}
              >
                {label}
              </NavSearchTab>
            ))}
          </div>
        </div>
      </div>
      <div className="pb-3 px-8 flex-1 overflow-x-hidden overflow-y-auto">
        <div className="custom-flex-col">
          <div className="sticky top-0 z-[2] flex justify-between pt-3 pb-2 pr-16 bg-white dark:bg-black text-text-tertiary text-base font-normal capitalize">
            <p className="dark:text-darkText-1">{tabs[activeTab].label}</p>
            <p className="dark:text-darkText-1">type</p>
          </div>
          <div className="relative z-[1] custom-flex-col gap-3">
            {Array(10)
              .fill(null)
              .map((_, idx) => (
                <NavGlobalSearchItem key={idx} icon={tabs[activeTab].icon} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavGlobalSearch;
