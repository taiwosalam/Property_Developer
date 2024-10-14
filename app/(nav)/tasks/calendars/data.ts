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
