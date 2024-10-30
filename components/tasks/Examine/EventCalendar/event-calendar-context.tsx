"use client";

import { createContext, useContext } from "react";

// Types
import type { EventCalendarContextProps } from "./types";

export const EventCalendarContext = createContext<
  EventCalendarContextProps | undefined
>(undefined);

export const useEventCalendar = () => {
  const context = useContext(EventCalendarContext);

  if (!context) {
    throw new Error(
      "useEventCalendar must be used within a EventCalendarProvider"
    );
  }

  return context;
};
