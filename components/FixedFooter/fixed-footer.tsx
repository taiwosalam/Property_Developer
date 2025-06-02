"use client";

import React from "react";

// Imports
import clsx from "clsx";
import { useLayout } from "../Layout/layout-context";
import useSettingsStore from "@/store/settings";
import { getLocalStorage } from "@/utils/local-storage";

const FixedFooter: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className }) => {
  const { isSideNavOpen } = useLayout();
  const { selectedOptions } = useSettingsStore();
  // const navbar = selectedOptions.navbar;
  const navbar = getLocalStorage("navbar")

  return (
    <footer
      style={{ boxShadow: "0px -2px 10px 0px rgba(0, 0, 0, 0.05)", ...style }}
      className={clsx(
        "fixed fixed-footer-wrapepr z-10 bottom-0 left-0 right-0 py-5 px-4 md:px-[30px] lg:px-[60px] bg-white dark:bg-darkText-primary duration-300",
        {
          "md:left-[235px] lg:left-[250px] md:w-[calc(100vw-235px)] lg:w-[calc(100vw-250px)] bg-black":
            isSideNavOpen && navbar !== "row",
        },
        {
          "md:left-[110px] md:w-[calc(100vw-110px)] bg-red-500":
            !isSideNavOpen && navbar !== "row",
        },
        className
      )}
    >
      {children}
    </footer>
  );
};

export default FixedFooter;
