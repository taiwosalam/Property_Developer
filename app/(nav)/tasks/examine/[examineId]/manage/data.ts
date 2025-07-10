import api, { handleAxiosError } from "@/services/api";

export const examineService = [
  "Electricity",
  "Water",
  "Drainage",
  "Sewer",
  "Smoke Detector",
  "Gas",
];

export const inspectionCheckList = [
  "Outdoor Steps and Sidewalk",
  "Dining Rooms",
  "Outdoor Paint",
  "Den(s)",
  "Driveway",
  "Study Room(s)",
  "Storage Room(s)",
  "Outdoor Plantation",
  "Outdoor Entry Way",
  "Game Room(s)",
  "Doors",
  "Music Room(s)",
  "Door Fixtures",
  "Fireplaces",
  "Flooring",
  "Carpentry",
  "Bathroom Tiles",
  "Bathroom Faucets",
  "Window",
  "Water Pressure",
  "Window Screen",
  "Kitchen",
  "Window Fixtures",
  "Laundry",
  "Window Furnishing",
  "Lighting",
  "Ceilings",
  "Disposal",
  "Light Fixtures",
  "Shelving",
  "Staircases",
  "Bedrooms",
  "Indoor Paint",
  "Wardrobes and Closets",
  "Electrical Outlets and Fixtures",
  "Living Room",
];

export interface IExaminePageData {
  id: number;
  date: string;
  added_guest: string;
  assign_staff: string;
  description: string;
  inspection_summary_notes: string;
  inspection_checklist: {
    [key: string]: string;
  }[];
  inspection_summary: {
    [key: string]: string;
  }[];
  service: string[];
  send_to_landlord: boolean;
  send_to_tenant: boolean;
}
export const transformExamineManageData = (
  res: ExamineSingleDataResponse
): IExaminePageData => {
  const { data } = res;
  return {
    id: data?.id,
    date: data?.examine_date || "--- ---",
    added_guest: data?.added_guest || "--- ---",
    assign_staff: data?.assign_staff || "--- ---",
    description: data?.description || "--- ---",
    inspection_summary_notes: data?.inspection_summary_note || "--- ---",
    inspection_checklist: data?.inspection_checklist?.map((checklist) => ({
      ...checklist,
    })),
    inspection_summary: data?.inspection_summary?.map((summary) => ({
      ...summary,
    })),
    service: data?.service?.map((service) => service),
    send_to_landlord: data?.send_to_landlord,
    send_to_tenant: data?.send_to_tenant,
  };
};

export const updateExamine = async (id: string, data: any) => {
  try {
    const res = await api.put(`/examine/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchExamine"));
      return true;
    }
  } catch (error) {
    console.error(error);
    handleAxiosError(error);
    return false;
  }
};
export const deleteExamine = async (id: string) => {
  try {
    const res = await api.delete(`/examine/${id}`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchExamine"));
      return true;
    }
  } catch (error) {
    console.error(error);
    handleAxiosError(error);
    return false;
  }
};
