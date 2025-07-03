import api, { handleAxiosError } from "@/services/api";

export const announcementrFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const getAllAnnouncements = async () => {};

export const createAnnouncement = async (formData: FormData) => {
  try {
    const res = await api.post(`/announcements`, formData);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchAnnouncement"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateAnnouncement = async (formData: FormData, id: string) => {
  try {
    const res = await api.post(`/announcements/${id}`, formData);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchAnnouncement"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteAnnouncement = async (id: string) => {
  try {
    const res = await api.delete(`/announcements/${id}`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchAnnouncement"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const postLikeOrDislike = async (id: string, route: string) => {
  try {
    const res = await api.post(`announcements/${id}/${route}`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchAnnouncement"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
