import dayjs from "dayjs";
import { ComplaintDetailResponse } from "../../types";
import api, { handleAxiosError } from "@/services/api";

export interface IManageComplaints {
  aboutCard: {
    label: string;
    value: string | null;
  }[];
  description: string | null;
  tier_id: number;
  notes: {
    date: string;
    text: string;
    time: string;
    title: string;
    note_by: string;
  }[];
  images: {
    src: string;
    isVideo: boolean;
  }[];
  progress: number;
  updated_at: string;
}

export const transformComplaintManage = (
  data: ComplaintDetailResponse
): IManageComplaints => {
  return {
    aboutCard: [
      {
        label: "Complaints sent by",
        value: data?.complaint.complaint_by,
      },
      {
        label: "Complaint ID",
        value: data?.complaint?.id.toString(),
      },
      {
        label: "Property Name",
        value: data?.complaint?.property_title,
      },
      {
        label: "Property Address",
        value: data?.complaint?.property_address,
      },
      {
        label: "Account Officer",
        value: data?.complaint?.account_officer,
      },
    ],
    description: data?.complaint?.description,
    tier_id: data?.complaint?.tier,
    notes:
      data?.complaint.notes &&
      data?.complaint?.notes?.map((note) => ({
        date: note?.date,
        text: note.text,
        time: note?.time,
        title: note?.title,
        note_by: note?.note_by,
      })),
    images: data?.complaint?.images?.map((media) => ({
      src: media,
      isVideo: false,
    })),
    progress: data?.complaint?.progress,
    updated_at: data?.complaint
      ? dayjs(data?.complaint?.updated_at).format("MMMM D, YYYY")
      : "",
  };
};

interface ITaskReminder {
  title: string;
  note: string;
  date: Date;
  id: string;
}
export const createReminder = async ({
  title,
  note,
  date,
  id,
}: ITaskReminder) => {
  const endpoint = `complaints/${id}/reminder?title=${title}&note=${note}&reminder_date=${date}`;
  try {
    const res = await api.post(endpoint);
    if (res) {
      window.dispatchEvent(new Event("manageComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export interface IComplaintEditNote {
  index: number;
  title: string;
  note: string;
  id: string;
}
export const updateComplaintNote = async ({
  index,
  title,
  note,
  id,
}: IComplaintEditNote) => {
  const payload = {
    note_index: index,
    title,
    note,
  };

  try {
    const response = await api.post(`complaints/${id}/update-note`, payload);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("manageComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
