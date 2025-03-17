import api, { handleAxiosError } from "@/services/api";

// /property-document
export const createPropertyDocument = async (data: FormData) => {
  try {
    const res = await api.post("/property-document", data);
    if (res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const DocumentssFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "Branch1" },
      { label: "Branch 2", value: "Branch2" },
      { label: "Branch 3", value: "Branch3" },
    ],
  },
];
