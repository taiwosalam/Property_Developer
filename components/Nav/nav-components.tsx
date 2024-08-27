import React from "react";

// Types
import type { NavButtonProps } from "./types";

// Imports
import SVG from "../SVG/svg";
import clsx from "clsx";

export const NavButton: React.FC<NavButtonProps> = ({
  type,
  style,
  children,
  minimized,
}) => {
  return (
    <button className="w-full py-3 pl-10 pr-5 flex items-center gap-4 nav-button" style={style}>
      {type && (
        <SVG
          type={type}
          color="#0033C4"
          className="w-[30px] flex justify-center"
        />
      )}
      <p
        className={clsx("text-brand-9 capitalize", {
          "text-base font-bold": !minimized,
          "text-sm font-medium": minimized,
        })}
      >
        {children}
      </p>
    </button>
  );
};
