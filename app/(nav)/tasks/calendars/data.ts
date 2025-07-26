import type { Field } from "@/components/Table/types";
import { CalendarEventsApiResponse } from "./types";
import { CalendarEventProps } from "@/components/Calendar/types";
import dayjs from "dayjs";
export const calendarsrFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const getAllEventsOnCalendar = async () => {};

export const CalendarTableFields: Field[] = [
  { id: "1", label: "Date & Time", accessor: "date" },
  { id: "5", label: "branch", accessor: "branch" },
  { id: "4", label: "property name", accessor: "property_name" },
  { id: "3", label: "creator", accessor: "creator" },
  { id: "2", label: "Event", accessor: "event" },

  // { id: "6", label: "account officer", accessor: "account_officer" },
];

// Add type guard to validate event types
type CalendarEventType =
  | "new rent"
  | "inspections"
  | "complaints"
  | "due rent"
  | "examines"
  | "applications"
  | "maintenance"
  | "multiple event"
  | "reminder";

const isValidEventType = (type: string): type is CalendarEventType => {
  return [
    "new rent",
    "inspections",
    "complaints",
    "due rent",
    "examines",
    "applications",
    "maintenance",
    "multiple event",
    "reminder",
  ].includes(type);
};

export const transformCalendarEvents = (
  events: CalendarEventsApiResponse
): CalendarEventProps[] => {
  return events.data.map((event) => {
    const eventType = isValidEventType(event.type)
      ? event.type
      : "multiple event";

    return {
      date: new Date(event.date),
      desc: event.description,
      title: event.type,
      //originalType: event.type,
      type: eventType, // Now properly typed as CalendarEventType
    };
  });
};

export interface ICalendarEventsTable {
  total_pages: number;
  current_page: number;
  table: {
    date: string;
    event: string;
    creator: string;
    property_name: string;
    branch: string | null;
    account_officer: string | null;
  }[];
}

export const transformEventTable = (
  event: CalendarEventsApiResponse
): ICalendarEventsTable => {
  return {
    total_pages: event?.pagination?.total_pages || 0,
    current_page: event?.pagination?.current_page || 0,
    table: event.data.map((item) => ({
      date: item?.date
        ? dayjs(item.date).format("DD/MM/YYYY HH:mm A")
        : "___ ___",
      event: item?.description || "___ ___",
      creator: item.creator?.toLowerCase() || "___ ___",
      property_name: item.property || "___ ___",
      branch: item.branch || "___ ___",
      account_officer: item.accountOfficer || "___ ___",
    })),
  };
};
