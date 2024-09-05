import React from "react";

// Types
import type { Color } from "@/types/global";
import type { NavButtonProps } from "./types";

// Imports
import clsx from "clsx";
import SVG from "../SVG/svg";
import { useThemeStoreSelectors } from "@/store/themeStore";
import Link from "next/link";

export const NavButton: React.FC<NavButtonProps> = ({
  type,
  href,
  style,
  children,
  minimized,
  highlight,
}) => {
  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  const color = highlight ? "#fff" : (primaryColor as Color);

  const content = (
    <div
      className={clsx("w-full py-3 pl-10 pr-5 flex items-center gap-4", {
        "nav-button": !minimized,
        "hover:bg-brand-3": minimized,
        "custom-primary-bg": highlight,
      })}
      style={style}
    >
      {type && (
        <SVG
          type={type}
          color={color}
          className="w-[30px] flex justify-center"
        />
      )}
      <p
        className={clsx("capitalize", {
          "text-white": highlight,
          "custom-primary-color": !highlight,
          "text-base font-bold": !minimized,
          "text-sm font-medium": minimized,
        })}
      >
        {children}
      </p>
    </div>
  );

  return href ? (
    <Link className="w-full" href={href}>
      {content}
    </Link>
  ) : (
    <button className="w-full">{content}</button>
  );
};
