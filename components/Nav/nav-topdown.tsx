"use client";
import { useState } from "react";
import Menu from "@mui/material/Menu";
import type { NavDropdownProps } from "./types";
import { NavButton } from "./nav-components";
import { usePathname } from "next/navigation";
import useDarkMode from "@/hooks/useCheckDarkMode";

const TopNavDropdown: React.FC<NavDropdownProps> = ({
  type,
  content,
  children,
  highlight,
}) => {
  const isDarkMode = useDarkMode();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent) => {
    setAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <NavButton
        type={type}
        highlight={highlight || Boolean(anchorEl)}
        onClick={handleClick}
        isDropdown
        topNav
        isOpen={Boolean(anchorEl)}
      >
        {children}
      </NavButton>

      <Menu
        id="dropdown-menu"
        MenuListProps={{
          "aria-labelledby": "dropdown-button",
          sx: {
            padding: 0,
          },
        }}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ paper: "custom-round-scrollbar" }}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: isDarkMode ? "#020617" : "#fff",
            padding: 0,
            mt: 1,
            boxShadow:
              "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
            minWidth: "15vw",
            borderRadius: "0.5rem",
            overflow: "auto",
            maxHeight: "50vh",
          },
        }}
      >
        {content.map(({ href, label }, index) => (
          <NavButton
            minimized_highlight={
              href ? pathname.includes(`${children}${href}`) : false
            }
            href={href && `/${children}${href}`}
            key={index}
            minimized
            topNav
            type="horizontal_line"
            onClick={handleClose}
          >
            {label}
          </NavButton>
        ))}
      </Menu>
    </>
  );
};

export default TopNavDropdown;
