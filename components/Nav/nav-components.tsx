import React from "react";
import Link from "next/link";

// Types
import type { Color } from "@/types/global";
import type {
  NavButtonProps,
  NavCreateNewColumnProps,
  NavIconProps,
  NavSearchTabProps,
} from "./types";

// Imports
import clsx from "clsx";
import SVG from "../SVG/svg";
import Picture from "../Picture/picture";
import { useThemeStoreSelectors } from "@/store/themeStore";

export const NavButton: React.FC<NavButtonProps> = ({
  type,
  href,
  style,
  children,
  minimized,
  highlight,
  minimized_highlight,
}) => {
  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  const color = highlight ? "#fff" : (primaryColor as Color);

  const content = (
    <div
      className={clsx("w-full py-3 pl-10 pr-5 flex items-center gap-4", {
        "nav-button": !minimized,
        "hover:bg-brand-3": minimized,
        "bg-brand-3": minimized_highlight,
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

export const NavIcon: React.FC<NavIconProps> = ({ src, alt, href }) => {
  const class_styles = "p-2 rounded-lg bg-background-2";
  const content = <Picture src={src} alt={alt} size={20} />;

  return href ? (
    <Link href={href} className={class_styles}>
      {content}
    </Link>
  ) : (
    <button className={class_styles}>{content}</button>
  );
};

export const NavCreateNewColumn: React.FC<NavCreateNewColumnProps> = ({
  data = [],
}) => {
  const options = ["management", "tasks", "accounting", "documents"];
  const content = data.filter((item) =>
    options.includes(item.label.toLowerCase())
  );

  return (
    <div className="flex gap-10">
      {content.map(({ type, label, content }, index) => (
        <div key={index} className="custom-flex-col text-base font-medium">
          <div className="flex items-center gap-2">
            <SVG
              type={type}
              color="#050901"
              className="w-[30px] flex justify-center"
            />
            <p className="text-text-primary capitalize">{label}</p>
          </div>
          {content?.map(({ label }, idx) => (
            <div key={idx} className="py-3 pl-10 pr-5">
              <button className="flex items-center gap-4">
                <SVG
                  type="horizontal_line"
                  className="w-[30px] flex justify-center"
                />
                <p className="text-text-secondary capitalize">{label}</p>
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const NavSearchTab: React.FC<NavSearchTabProps> = ({
  count,
  active,
  children,
}) => (
  <button className="flex items-center gap-2 text-base font-medium capitalize">
    <p
      className={clsx({
        "text-text-label": !active,
        "text-brand-9": active,
      })}
    >
      {children}
    </p>
    <div
      className={clsx("w-6 h-6 flex items-center justify-center rounded-full", {
        "bg-neutral-3": !active,
        "bg-brand-9": active,
      })}
    >
      <p
        className={clsx({
          "text-neutral-4": !active,
          "text-white": active,
        })}
      >
        {count}
      </p>
    </div>
  </button>
);
