import api, { handleAxiosError } from "@/services/api";

export const complainrFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const getAllComplains = async () => {};

export const createComplain = async (formData: FormData) => {
  try {
    const res = await api.post(`/complains`, formData);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateComplain = async (formData: FormData, id: string) => {
  try {
    const res = await api.post(`/complains/${id}`, formData);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteComplain = async (id: string) => {
  try {
    const res = await api.delete(`/complains/${id}`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const postLikeOrDislike = async (id: string, route: string) => {
  try {
    const res = await api.post(`complains/${id}/${route}`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
