import api, { handleAxiosError } from "@/services/api";

export const examineFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const getAllExamine = async () => {};

export const createExamine = async (data: FormData) => {
  try {
    const res = await api.post(`/examine/create`, data);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchExamine"));
      return true;
    }
  } catch (error) {
    console.log(error);
    handleAxiosError(error);
    return false;
  }
};
