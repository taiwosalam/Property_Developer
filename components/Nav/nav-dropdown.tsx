"use client";

import { usePathname } from "next/navigation";

// Types
import type { NavDropdownProps } from "./types";

// Imports
import { NavButton } from "./nav-components";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import { useRole } from "@/hooks/roleContext";
import clsx from "clsx";

const NavDropdown: React.FC<NavDropdownProps> = ({
  type,
  content,
  children,
  highlight,
  onContentClick,
  isOpen,
  onToggle,
  isCollapsed,
  className,
}) => {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const isDirector = role === "director";

  return (
    <div
      className={clsx("nav-dropdown", className)}
      title={isCollapsed ? String(children) : undefined}
    >
      <NavButton
        type={type}
        highlight={isOpen || highlight}
        onClick={onToggle}
        isDropdown
        isOpen={isOpen}
        isCollapsed={isCollapsed}
      >
        {children}
      </NavButton>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="custom-flex-col"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "unset" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            key="drop-down-content"
          >
            {content.map(({ href, label }, index) => (
              <NavButton
                onClick={onContentClick}
                minimized_highlight={
                  isDirector
                    ? href
                      ? pathname.includes(`${children}${href}`)
                      : false
                    : href
                    ? pathname.includes(`${href}`)
                    : false
                }
                href={
                  isDirector ? href && `/${children}${href}` : href && `${href}`
                }
                key={index}
                minimized
                type="horizontal_line"
                isCollapsed={isCollapsed}
              >
                {label}
              </NavButton>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDropdown;
