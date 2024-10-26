import type { Field } from "@/components/Table/types";
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

export const getAllEventsOnCalendar = async (access_token: string | null) => {
  try {
    const response = await fetch(`${BASE_URL}/calendars`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }).then((res) => res.json());
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error: error };
  }
};

export const CalendarTableFields: Field[] = [
  { id: "1", label: "Date & Time", accessor: "date" },
  { id: "2", label: "Event", accessor: "event" },
  { id: "3", label: "creator", accessor: "creator" },
  { id: "4", label: "property name", accessor: "property_name" },
  { id: "5", label: "branch", accessor: "branch" },
  { id: "6", label: "account officer", accessor: "account_officer" },
];
