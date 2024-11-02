// "use client";

// import { usePathname } from "next/navigation";
// import { useState } from "react"; // Import useState for managing anchorEl
// import Button from "@mui/material/Button";
// import Menu from "@mui/material/Menu";
// import MenuItem from "@mui/material/MenuItem";
// import { AnimatePresence, motion } from "framer-motion";
// import useSettingsStore from "@/store/settings"; // Ensure proper types are imported
// import { NavDropdownProps } from "./types";

// const NavDropdown: React.FC<NavDropdownProps> = ({
//   type,
//   content,
//   children,
//   highlight,
//   onContentClick,
//   isOpen,
//   onToggle,
//   isCollapsed,
//   topNav,
// }) => {
//   const pathname = usePathname();
//   const { selectedOptions } = useSettingsStore();
//   const navbar = selectedOptions.navbar;

//   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for Menu anchor

//   const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//     onToggle(); // Call the onToggle function to synchronize state
//   };

//   return (
//     <div
//       className="custom-flex-col items-center"
//       title={isCollapsed ? String(children) : undefined}
//     >
//       <button
//         id="dropdown-button"
//         aria-controls={Boolean(anchorEl) ? "dropdown-menu" : undefined}
//         aria-haspopup="true"
//         aria-expanded={Boolean(anchorEl) ? "true" : undefined}
//         onClick={handleClick}
//         className="capitalize text-brand-9 dark:text-brand-100"
//       >
//         {children}
//       </button>
//       <Menu
//         id="dropdown-menu"
//         anchorEl={anchorEl}
//         open={Boolean(anchorEl)}
//         onClose={handleClose}
//         MenuListProps={{
//           "aria-labelledby": "dropdown-button",
//         }}
//       >
//         <AnimatePresence>
//           {isOpen && (
//             <motion.div
//               className="custom-flex-col"
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: "unset" }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               key="drop-down-content"
//             >
//               {content.map(({ href, label }, index: number) => (
//                 <MenuItem
//                   key={index}
//                   onClick={() => {
//                     onContentClick && onContentClick(); // Execute the provided function
//                     handleClose(); // Close the menu
//                   }}
//                   component="a" // Use component="a" if you want it to be a link
//                   href={href && `/${children}${href}`} // Set the href if needed
//                 >
//                   {label}
//                 </MenuItem>
//               ))}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </Menu>
//     </div>
//   );
// };

// export default NavDropdown;

"use client";
import SVG from "../SVG/svg";
import { usePathname } from "next/navigation";
import { useState } from "react"; // Import useState for managing anchorEl
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { SvgIcon } from "@mui/material"; // Import SvgIcon for icons
import useSettingsStore from "@/store/settings"; // Ensure proper types are imported
import { NavDropdownProps } from "./types";
import { NavButton } from "./nav-components";
import clsx from "clsx";
import { useThemeStoreSelectors } from "@/store/themeStore";
import { Color } from "@/types/global";

const NavDropdown: React.FC<NavDropdownProps> = ({
  type,
  content,
  children,
  highlight,
  onContentClick,
  isOpen,
  onToggle,
  isCollapsed,
  topNav,
  minimized,
  style,
  isDropdown,
  minimized_highlight,
}) => {
  const pathname = usePathname();
  const { selectedOptions } = useSettingsStore();
  const navbar = selectedOptions.navbar;

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for Menu anchor

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    onToggle(); // Call the onToggle function to synchronize state
  };

  const primaryColor = useThemeStoreSelectors.use.primaryColor();
  const secondaryColor = useThemeStoreSelectors.use.secondaryColor();
  const color = highlight ? "#fff" : (primaryColor as Color);

  return (
    <div
      className="flex items-center"
      title={isCollapsed ? String(children) : undefined}
    >
      <div
        className={clsx("w-full py-3 pl-10 pr-5 flex items-center gap-4", {
          "nav-button": !minimized,
          "nav-button-minimized": minimized,
          "custom-primary-bg": highlight,
        })}
        style={{
          backgroundColor: minimized_highlight ? secondaryColor : undefined,
          ...style,
        }}
      >
        {type && (
          <SVG
            type={type}
            color={color}
            className={clsx("w-[30px] flex-shrink-0 flex justify-center", {
              "path-fill": type === "chart",
            })}
          />
        )}
        <Button
          id="dropdown-button"
          aria-controls={Boolean(anchorEl) ? "dropdown-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={Boolean(anchorEl) ? "true" : undefined}
          onClick={handleClick}
          className="capitalize text-brand-9 dark:text-brand-100"
        >
          <p
            className={clsx("capitalize", {
              "text-white": highlight,
              "custom-primary-color": !highlight,
              "text-base font-bold": !minimized,
              "text-sm font-medium": minimized,
            })}
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {children}
          </p>
          {isDropdown && (
            <div
              className={clsx(
                "absolute right-0 top-[50%] translate-y-[-50%] transition-transform duration-300",
                !isOpen && "rotate-180"
              )}
            >
              <SVG
                type="arrow_down"
                color={isOpen || highlight ? "#fff" : (primaryColor as Color)}
              />
            </div>
          )}
        </Button>
      </div>
      <Menu
        id="dropdown-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "dropdown-button",
        }}
        classes={{ paper: "custom-round-scrollbar" }}
        sx={{
          "& .MuiPaper-root": {
            padding: 0,
            boxShadow: "lg",
            minWidth: "15vw",
            borderRadius: "0.5rem",
            overflow: "auto",
            maxHeight: "50vh",
          },
        }}
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
      </Menu>
    </div>
  );
};

export default NavDropdown;
