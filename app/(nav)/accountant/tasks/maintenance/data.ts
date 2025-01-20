import type { FilterOptionMenu } from "@/components/Management/Landlord/types";

export const maintenanceFilterOptionsWithDropdown: FilterOptionMenu[] = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    radio: true,
    label: "Status",
    value: [
      { label: "all", value: "all", isChecked: true },
      { label: "Pending", value: "Pending" },
      { label: "Ongoing", value: "Ongoing" },
      { label: "Completed", value: "Completed" },
    ],
  },
];

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
