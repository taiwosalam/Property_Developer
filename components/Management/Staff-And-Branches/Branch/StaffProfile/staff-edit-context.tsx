"use client";
import React from "react";
import { createContext, useContext } from "react";
import type { StaffProfileProps } from "./types";

interface StaffEditContextProps {
  data: StaffProfileProps | null;
}

export const StaffEditContext = createContext<
  StaffEditContextProps | undefined
>(undefined);

export const useStaffEditContext = () => {
  const context = useContext(StaffEditContext);

  if (!context) {
    throw new Error(
      "useStaffEditContext must be used within a StaffEditProvider"
    );
  }
  return context;
};
