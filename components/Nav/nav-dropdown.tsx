"use client";

import { usePathname } from "next/navigation";

// Types
import type { NavDropdownProps } from "./types";

// Imports
import { NavButton } from "./nav-components";
import { AnimatePresence, motion } from "framer-motion";

const NavDropdown: React.FC<NavDropdownProps> = ({
  type,
  content,
  children,
  highlight,
  onContentClick,
  isOpen,
  onToggle,
  isCollapsed,
}) => {
  const pathname = usePathname();

  return (
    <div
      className="custom-flex-col"
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
                  href ? pathname.includes(`${children}${href}`) : false
                }
                href={href && `/${children}${href}`}
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
