"use client";

import React, { useState } from "react";

// Types
import type { NavDropdownProps } from "./types";

// Imports
import { NavButton } from "./nav-components";
import SVG from "../SVG/svg";
import { boolean } from "zod";
import clsx from "clsx";

const NavDropdown: React.FC<NavDropdownProps> = ({
  type,
  content,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="custom-flex-col">
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="relative flex items-center nav-button"
      >
        <NavButton type={type}>{children}</NavButton>
        <div
          className={clsx("absolute right-1", {
            "rotate-0": isOpen,
            "rotate-180": !isOpen,
          })}
        >
          <SVG type="arrow_down" color="#0033C4" />
        </div>
      </div>
      {isOpen && (
        <div className="h-full">
          <div className="custom-flex-col">
            {content.map((item, index) => (
              <NavButton key={index} minimized type="horizontal_line">
                {item}
              </NavButton>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavDropdown;
