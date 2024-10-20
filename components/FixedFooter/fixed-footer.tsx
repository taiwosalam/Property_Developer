import React from "react";
import { useLayout } from "../Layout/layout-context";
import clsx from "clsx";

const FixedFooter: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}> = ({ children, style, className }) => {
  const { isSideNavOpen } = useLayout();
  return (
    <footer
      style={style}
      className={clsx(
        "fixed z-10 bottom-0 left-0 right-0 py-5 px-[30px] md:px-[40px] lg:px-[60px] bg-white duration-300",
        {
          "md:left-[235px] lg:left-[250px] md:w-[calc(100vw-235px)] lg:w-[calc(100vw-250px)]":
            isSideNavOpen,
        },
        {
          "md:left-[110px] md:w-[calc(100vw-110px)]": !isSideNavOpen,
        },
        className
      )}
    >
      {children}
    </footer>
  );
};

export default FixedFooter;
