"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

// Types
import type { NavDropdownProps } from "./types";

// Imports
import clsx from "clsx";
import SVG from "../SVG/svg";
import { Color } from "@/types/global";
import { NavButton } from "./nav-components";
import { useThemeStoreSelectors } from "@/store/themeStore";

const NavDropdown: React.FC<NavDropdownProps> = ({
  type,
  content,
  children,
  highlight,
}) => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(highlight);

  const primaryColor = useThemeStoreSelectors.use.primaryColor();

  return (
    <div className="custom-flex-col">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center nav-button"
      >
        <NavButton type={type} highlight={isOpen || highlight}>
          {children}
        </NavButton>
        <div
          className={clsx("absolute right-5", {
            "rotate-0": isOpen,
            "rotate-180": !isOpen,
          })}
        >
          <SVG
            type="arrow_down"
            color={isOpen || highlight ? "#fff" : (primaryColor as Color)}
          />
        </div>
      </div>
      {isOpen && (
        <div className="h-full">
          <div className="custom-flex-col">
            {content.map(({ href, label }, index) => (
              <NavButton
                minimized_highlight={
                  href ? pathname.includes(`${children}${href}`) : false
                }
                href={href && `/${children}${href}`}
                key={index}
                minimized
                type="horizontal_line"
              >
                {label}
              </NavButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
