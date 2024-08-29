import React from "react";

// Types
import type { Color } from "@/types/global";
import type { NavButtonProps } from "./types";

// Imports
import clsx from "clsx";
import SVG from "../SVG/svg";
import { useThemeStoreSelectors } from "@/store/themeStore";

export const NavButton: React.FC<NavButtonProps> = ({
  type,
  style,
  children,
  minimized,
}) => {
  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  return (
    <button
      className="w-full py-3 pl-10 pr-5 flex items-center gap-4 nav-button"
      style={style}
    >
      {type && (
        <SVG
          type={type}
          color={primaryColor as Color}
          className="w-[30px] flex justify-center"
        />
      )}
      <p
        className={clsx("custom-primary-color capitalize", {
          "text-base font-bold": !minimized,
          "text-sm font-medium": minimized,
        })}
      >
        {children}
      </p>
    </button>
  );
};
