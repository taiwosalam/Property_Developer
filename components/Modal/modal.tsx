"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

// Types
import type {
  ModalContentProps,
  ModalContextProps,
  ModalProps,
  ModalTriggerProps,
} from "./types";

// Imports
import clsx from "clsx";
import PopupPortal from "../PopupPortal/PopupPortal";
import useDarkMode from "@/hooks/useCheckDarkMode";

// Create a context for managing modal state and actions
const ModalContext = createContext<ModalContextProps | undefined>(undefined);

const Modal: React.FC<ModalProps> = ({ state, children }) => {
  // Local state to manage whether the modal is open or not
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Use the provided state or fallback to local state
  const data = state || {
    isOpen,
    setIsOpen,
  };

  // Provide context value to children
  return <ModalContext.Provider value={data}>{children}</ModalContext.Provider>;
};

// Custom hook to access the modal context
const useModal = (): ModalContextProps => {
  // Access the modal context
  const context = useContext(ModalContext);

  // Throw an error if the hook is used outside of a Modal
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }

  return context;
};

const ModalTrigger: React.FC<ModalTriggerProps> = ({
  close,
  asChild,
  children,
  ...props
}) => {
  const { setIsOpen } = useModal();
  const isDarkMode = useDarkMode();
  // Handle click event to open or close the modal
  const handleClick: React.MouseEventHandler<HTMLElement> = (e) => {
    e.preventDefault();
    setIsOpen(close ? false : true);
  };

  // If asChild is true, clone the child element and pass the onClick handler
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: handleClick,
      ...props,
    });
  }

  // Render a button with the onClick handler
  return (
    <button onClick={handleClick} type="button" {...props}>
      {children}
    </button>
  );
};

const ModalContent: React.FC<ModalContentProps> = ({
  style,
  children,
  className,
  ...props
}) => {
  const { isOpen, setIsOpen } = useModal();
  const isDarkMode = useDarkMode(); 
  // Handle clicks outside the modal to close it
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false);
    }
  };

  // Handle Escape key press to close the modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Render nothing if the modal is not open
  if (!isOpen) return null;

  return (
    <PopupPortal>
      <div
        onClick={handleOutsideClick}
        className={clsx(
          "w-screen h-screen flex items-center justify-center",
          className
        )}
        style={{
          backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1m)" : "#00000033",
          ...style
        }}
        {...props}
      >
        {children}
      </div>
    </PopupPortal>
  );
};

export { Modal, ModalTrigger, ModalContent, useModal };
