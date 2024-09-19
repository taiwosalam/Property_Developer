"use client";

import { createContext, useContext } from "react";

// Types
import type { AddUnitFormCardContextProps } from "./types";

export const AddUnitFormCardContext = createContext<
  AddUnitFormCardContextProps | undefined
>(undefined);

export const useAddUnitFormCard = (): AddUnitFormCardContextProps => {
  const context = useContext(AddUnitFormCardContext);

  if (!context) {
    throw new Error(
      "useAddUnitFormCard must be used within a AddUnitFormCardContextProvider"
    );
  }

  return context;
};
