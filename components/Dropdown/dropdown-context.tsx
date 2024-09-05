import { createContext, useContext } from "react";

// Types
import type { DropdownContextProps } from "./types";

export const DropdownContext = createContext<DropdownContextProps | undefined>(
  undefined
);

export const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (context === undefined) {
    throw new Error(
      "useDropdownContext must be used within a DropdownProvider"
    );
  }
  return context;
};
