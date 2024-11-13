export const maintenanceFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const maintenanceFilterOptionsWithRadio = [
  {
    label: "Status",
    value: [
      { label: "Pending", value: "Pending" },
      { label: "Ongoing", value: "Ongoing" },
      { label: "Completed", value: "Completed" },
      { label: "all", value: "all" },
    ],
  },
];

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const createMaintenance = async (
  data: FormData //change to formdata later
) => {};

export const getALLMaintenance = async () => {};

export const getMaintenanceById = async (id: string) => {};

export const updateMaintenance = async (
  id: string,
  data: FormData //change to formdata later
) => {};

export const deleteMaintenance = async (id: string) => {};
