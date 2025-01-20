// Constants
export const calendar_layouts = ["Year", "Month", "Week"] as const;

// Types
export type CalendarLayoutType = (typeof calendar_layouts)[number];
