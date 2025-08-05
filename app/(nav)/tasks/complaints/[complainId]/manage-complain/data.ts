import dayjs, { Dayjs } from "dayjs";
import { ComplaintDetailResponse } from "../../types";
import api, { handleAxiosError } from "@/services/api";

import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export interface IManageComplaints {
  aboutCard: {
    label: string;
    value: string | null;
  }[];
  description: string | null;
  tier_id: number;
  branch_id: number;
  landlord_agent: string;
  status: boolean;
  notes: {
    date: string;
    text: string;
    time: string;
    title: string;
    note_by: string;
    assign_to: string;
    assign_type: string;
  }[];
  images: {
    src: string;
    isVideo: boolean;
  }[];
  progress: number;
  updated_at: string;
  comments: {
    id: number;
    user: string;
    userId: number;
    text: string;
    avatar: string;
    time: string;
  }[];
  reminders: {
    date: Date;
    desc: string;
    title: string;
    type: "reminders";
    created_at?: string;
  }[];
  task_bar: {
    progress: string;
    text: string;
    approve_by: string;
    time: string;
    date: string;
  }[];
  task: {
    title: string;
    approve_by: string;
    time: string;
    date: string;
  };
}

export const transformComplaintManage = (
  data: ComplaintDetailResponse
): IManageComplaints => {
  return {
    aboutCard: [
      {
        label: "Title",
        value: data?.complaint?.title,
      },
      {
        label: "Complainant",
        value: data?.complaint.complaint_by,
      },
      {
        label: "Complaint ID",
        value: data?.complaint?.id.toString(),
      },
      {
        label: "Unit Name",
        value: data?.complaint?.unit_name,
      },
      {
        label: "Property Name",
        value: data?.complaint?.property_title,
      },

      {
        label: "Account Manager",
        value: data?.complaint?.account_officer,
      },

      {
        label: "Property Address",
        value: data?.complaint?.property_address,
      },
    ],
    task: {
      approve_by: data?.complaint?.approved_by?.toLowerCase() || "--- ---",
      title: data?.complaint?.title || "--- ---",
      date: data?.complaint?.created_at
        ? dayjs(data?.complaint?.created_at).format("DD/MM/YYYY")
        : "--- ---",
      time: data?.complaint?.created_at
        ? dayjs.utc(data?.complaint?.created_at).local().format("hh:mm A")
        : "--- ---",
    },
    description: data?.complaint?.description,
    status:
      data?.complaint?.status?.toLowerCase() === "rejected" ||
      data?.complaint?.status?.toLowerCase() === "completed"
        ? true
        : false,
    tier_id: data?.complaint?.tier,
    branch_id: data?.complaint?.branch_id,
    landlord_agent: data?.complaint?.landlord_agent,
    notes:
      data?.complaint.notes &&
      data?.complaint?.notes?.map((note) => ({
        date: note?.date ? dayjs(note.date).format("MMMM D, YYYY") : "--- ---",
        text: note.text,
        time: note?.time
          ? dayjs(note.time, "HH:mm:ss").format("hh:mm A")
          : "--- ---",
        title: note?.title,
        note_by: note?.note_by,
        assign_to: note?.assign_to,
        assign_type: note?.assign_to_type,
      })),
    images: data?.complaint?.images?.map((media) => ({
      src: media,
      isVideo: false,
    })),
    progress:
      data?.complaint?.status?.toLowerCase() === "completed"
        ? 100
        : data?.complaint?.progress || 0,
    updated_at: data?.complaint
      ? dayjs(data?.complaint?.updated_at).format("DD/MM/YYYY")
      : "",
    comments: data?.complaint.comments.map((message) => ({
      id: message.id,
      text: message.content,
      time: message.created_at,
      user: message.user.name?.toLowerCase(),
      userId: message.user.id,
      avatar: message.user.picture,
    })),
    reminders: data?.complaint?.reminders.map((r) => ({
      date: new Date(r.reminder_date),
      desc: r.note,
      title: r.title,
      type: "reminders",
      created_at: r.created_at ? dayjs(r.created_at).format("hh:mm A") : "",
    })),
    task_bar: data?.complaint?.task_bar?.map((task) => ({
      progress: task?.progress,
      approve_by: task?.approve_by,
      date: task?.date,
      time: task?.time,
      text: task?.text,
    })),
  };
};

interface ITaskReminder {
  title: string;
  note: string;
  date: Dayjs | string | null ;
  id?: string;
}
export const createReminder = async ({
  title,
  note,
  date,
  id,
}: ITaskReminder) => {
  const payload = {
    title,
    note,
    reminder_date: date,
    complain_id: id
  };
  const endpoint = `complaint/reminder`;
  try {
    const res = await api.post(endpoint, payload);
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

export const sendTaskComment = async (id: string, content: string) => {
  const payload = {
    content,
  };

  try {
    const res = await api.post(`complaint/${id}/comment`, payload);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("manageComplain"));
      return true;
    }
  } catch (error) {
    console.log(error);
    handleAxiosError(error);
    return false;
  }
};

//const PROGRESS_STATUS = 16.7;
export const updateProgressStatus = async (
  id: string,
  statusText: string,
  progress: number
) => {
  const payload = {
    text: statusText,
  };
  try {
    const res = await api.post(
      `/complaints/${id}/update-progress?progress=${progress}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("manageComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export interface IAssignTask {
  id: string;
  note: string;
  assign_to: string;
  assign_to_type: string;
}
export const assignTask = async ({
  id,
  note,
  assign_to,
  assign_to_type,
}: IAssignTask) => {
  const payload = {
    note: note,
    assign_to: assign_to,
    assign_to_type: assign_to_type,
  };
  try {
    const res = await api.post(`complaints/${id}/add-note`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("manageComplain"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const transformReminderCalendarEvent = () => {
  return {};
};
