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
  children,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOutsideClick(dropdownRef, () => setIsOpen(false));

  return (
    <DropdownContext.Provider value={{ isOpen, setIsOpen }}>
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
  ...props
}) => {
  const { isOpen, setIsOpen } = useDropdownContext();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  return (
    <button
      className={clsx("text-start", className)}
      {...props}
      onClick={handleClick}
    />
  );
};

export const DropdownContent: React.FC<DropdownContentProps> = ({
  children,
  className,
  direction = "down",
  position = "right",
}) => {
  const { isOpen } = useDropdownContext();

  return (
    <div
      className={clsx(
        "absolute z-10 bg-white border border-solid border-neutral-4 rounded-lg overflow-hidden",
        {
          "opacity-100 pointer-events-auto visible": isOpen,
          "opacity-0 pointer-events-none invisible": !isOpen,
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
      }}
    >
      {children}
    </div>
  );
};
