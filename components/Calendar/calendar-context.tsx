import { createContext, useContext } from "react";

// Types
import type { CalendarContextProps } from "./types";

export const CalendarContext = createContext<CalendarContextProps | undefined>(
  undefined
);

export const useCalendar = () => {
  const context = useContext(CalendarContext);

  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }

  return context;
};
