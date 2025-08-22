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
  href: topHref,
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
            {content.map(({ href, label }, index) => {
              // Construct the full href: use topHref + content href if topHref exists
              const fullHref = topHref && href ? `${topHref}${href}` : href;
              return (
                <NavButton
                  onClick={onContentClick}
                  minimized_highlight={
                    fullHref ? pathname.includes(fullHref) : false
                  }
                  href={fullHref}
                  key={index}
                  minimized
                  type="horizontal_line"
                  isCollapsed={isCollapsed}
                >
                  {label}
                </NavButton>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavDropdown;
