import { useRef, useState } from "react";

// Types
import type {
  DropdownContentProps,
  DropdownProps,
  DropdownTriggerProps,
} from "./types";

// Imports
import clsx from "clsx";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { DropdownContext, useDropdownContext } from "./dropdown-context";

export const Dropdown: React.FC<DropdownProps> = ({
  style,
  state,
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const data = state || {
    isOpen,
    setIsOpen,
  };

  useOutsideClick(dropdownRef, () => data.setIsOpen(false));

  return (
    <DropdownContext.Provider value={data}>
      <div
        className={clsx("relative", className)}
        ref={dropdownRef}
        style={style}
      >
        {children}
      </div>
    </DropdownContext.Provider>
  );
};

export const DropdownTrigger: React.FC<DropdownTriggerProps> = ({
  className,
  children,
  ...props
}) => {
  const { isOpen, setIsOpen } = useDropdownContext();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <button
      type="button"
      className={clsx("text-start", className)}
      {...props}
      onClick={handleClick}
    >
      {children}
    </button>
  );
};

export const DropdownContent: React.FC<DropdownContentProps> = ({
  style,
  children,
  className,
  direction = "down",
  position = "right",
  ...props
}) => {
  const { isOpen } = useDropdownContext();

  return (
    <div
      className={clsx(
        "absolute z-10 bg-white dark:bg-darkText-primary border border-solid border-neutral-4 dark:border-[#3C3D37] rounded-lg overflow-hidden",
        {
          "opacity-100 pointer-events-auto block": isOpen,
          "opacity-0 pointer-events-none hidden": !isOpen,
          "top-[110%]": direction === "down",
          "bottom-[110%]": direction === "up",
          "left-0": position === "left",
          "right-0": position === "right",
        },
        className
      )}
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};
