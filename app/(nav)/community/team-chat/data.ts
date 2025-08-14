// Types
import type { MessageCardProps } from "@/components/Message/types";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

// Images
import Avatar1 from "@/public/empty/avatar-1.svg";
import Avatar2 from "@/public/empty/avatar-2.svg";
import Avatar3 from "@/public/empty/avatar-3.svg";
import Avatar4 from "@/public/empty/avatar-4.svg";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
//import { ChatMessage } from "./[id]/types";
import { Day } from "react-day-picker";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import advancedFormat from "dayjs/plugin/advancedFormat";
import { MessageChat } from "./types";

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(advancedFormat);

export const team_chat_data: MessageCardProps[] = [
  {
    id: "1",
    pfp: Avatar1,
    desc: "Hey, I just wanted to check in and see how you're doing. It's been a while since we last spoke, and I wanted to make sure everything is going well on your end. Let me know if you need anything!",
    time: "2:00 PM",
    fullname: "Security Department",
    messages: 5,
    verified: true,
    tier: 1,
    title: "",
    role: "",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "2",
    pfp: Avatar2,
    desc: "Can we reschedule our meeting to tomorrow? I have a conflict that came up last minute, and I want to make sure we have enough time to discuss everything thoroughly.",
    time: "3:15 PM",
    fullname: "Accounting Department",
    verified: true,
    tier: 1,
    title: "",
    role: "",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "3",
    pfp: Avatar3,
    desc: "Here's the document you requested. Let me know if you need any more information or if there are any changes you would like me to make before we finalize everything.",
    time: "1:30 PM",
    fullname: "Lounge & Drinks",
    messages: 2,
    tier: 1,
    title: "",
    role: "",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "4",
    pfp: Avatar4,
    desc: "I'm available to help with the project. Just let me know when you need me, and I'll be there to assist with anything that comes up. Looking forward to working together!",
    time: "4:00 PM",
    fullname: "Cleaning & Laundering",
    verified: false,
    tier: 1,
    title: "",
    role: "",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "5",
    pfp: Avatar1,
    desc: "Thanks for the update! Looking forward to it. If there's anything else you need from me before then, feel free to reach out.",
    time: "5:45 PM",
    fullname: "All Staff",
    messages: 3,
    tier: 1,
    title: "",
    role: "",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "6",
    pfp: Avatar2,
    desc: "Happy birthday! Hope you have a great day celebrating with friends and family. Don't forget to make a wish!",
    time: "6:20 PM",
    fullname: "HR Department",
    messages: 1,
    verified: true,
    tier: 1,
    title: "",
    role: "",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "7",
    pfp: Avatar3,
    desc: "Let me know if you need any further assistance. I'm here to help with anything you might need.",
    time: "7:00 PM",
    tier: 1,
    title: "",
    role: "",
    fullname: "Maintenance Department",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "8",
    pfp: Avatar4,
    desc: "I'm almost finished with the report. Just a few more details to wrap up, and I'll send it over for your review.",
    time: "8:10 PM",
    fullname: "Frontend Dev",
    verified: false,
    tier: 1,
    title: "",
    role: "",
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "9",
    pfp: Avatar1,
    tier: 1,
    title: "",
    role: "",
    desc: "Would you like to join us for dinner tonight? We're planning to go to a new restaurant that just opened downtown. It would be great to catch up with you!",
    time: "9:05 PM",
    fullname: "Backend Dev",
    messages: 4,
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
  {
    id: "10",
    pfp: Avatar2,
    tier: 1,
    title: "",
    role: "",
    desc: "Please review the attached file. It's important that we get this finalized before the end of the day.",
    time: "10:30 PM",
    fullname: "Marketing Department",
    verified: true,
    groupDesc:
      "Whirlwind Wanderers: A gathering of eclectic souls journeying through realms of adventure, discovery, and boundless curiosity.",
  },
];

export const team_chat_members_data = [
  { fullname: "Salam Aishat", pfp: Avatar1, position: "staff" },
  { fullname: "Salam Aishat", pfp: Avatar2, position: "Admin" },
  { fullname: "Salam Aishat", pfp: Avatar3, position: "manager" },
  { fullname: "Salam Aishat", pfp: Avatar4, position: "Admin" },
  { fullname: "Salam Aishat", pfp: Avatar4, position: "Staff" },
  { fullname: "Mubarak Abdullahi", pfp: Avatar4, position: "Admin" },
  { fullname: "Onos akpan", pfp: Avatar4, position: "Branch Manager" },
  { fullname: "Salam Aishat", pfp: Avatar4, position: "stafff" },
  { fullname: "Salam Taiwo", pfp: Avatar4, position: "Staff" },
  { fullname: "Salam Aishat", pfp: Avatar4, position: "Branch Manager" },
];

export const createNewTeamChat = async (data: FormData) => {
  try {
    const response = await api.post(`group-chats`, data);
    if (response.status === 201 || response.status === 200) {
      toast.success("Team chat created");
      window.dispatchEvent(new Event("refetchTeamChat"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const addUserToGroup = async (groupId: string, data: FormData) => {
  try {
    const response = await api.post(`group-chats/${groupId}/members`, data);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetch_team_chat"));
      toast.success("Member added successfully");
      return true;
      // return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateGroupNameAndDescription = async (
  groupId: string,
  name: string,
  description: string
) => {
  try {
    const response = await api.patch(
      `group-chat/${groupId}?description=${description}&name=${name}`
    );
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetchTeamChat"));
      toast.success("Updated successfully");
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateTeamAvatar = async (groupId: string, formData: FormData) => {
  try {
    const response = await api.patch(`group-chat/${groupId}/status`, formData);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetch_team_chat"));
      toast.success("Updated successfully");
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteMember = async (groupId: string, userId: string) => {
  try {
    const response = await api.delete(`group-chat/${groupId}/${userId}`);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetch_team_chat"));
      toast.success("Updated successfully");
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateGroupNameOrDescription = async (
  groupId: number,
  data: FormData
) => {
  try {
    const response = await api.post(`group-chats/${groupId}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (response.status === 201 || response.status === 200) {
      toast.success("Updated successfully");
      window.dispatchEvent(new Event("refetchTeamChat"));
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteGroupChat = async (groupId: number) => {
  try {
    const response = await api.delete(`group-chats/${groupId}`);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetchTeamChat"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateGroupAvatar = async (data: FormData) => {
  try {
    const response = await api.post(`group-chat/create`, data);
    if (response.status === 201 || response.status === 200) {
      toast.success("Avatar updated");
      window.dispatchEvent(new Event("refetch_team_chat"));
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const removeGroupMember = async (groupId: number, userId: number) => {
  try {
    const response = await api.delete(
      `group-chats/${groupId}/members?user_ids[]=${userId}`
    ); // Append user_ids as a query parameter
    if (response.status === 201 || response.status === 200) {
      window.dispatchEvent(new Event("refetchTeamChat"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const sendGroupMessage = async (groupId: string, data: FormData) => {
  try {
    const response = await api.post(`group-chat/${groupId}/send-message`, data);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetch_team_chat"));
      console.log(response);
      return response;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
}; 

export function isImageFile(filename: string): boolean {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(filename);
}

export const transformMessageData = (data: MessageChat[]) => {
  return data
    .map((m) => {
      const isImage = isImageFile(m?.content);
      return {
        content_type: isImage ? "image" : m?.content_type,
        time: dayjs(m?.created_at).format("h:mm A"),
        text: m?.content,
        from: m?.sender_id,
        sender_id: m?.sender_id,
      };
    })
    .reverse();
};

export const formatDate = (dateString: string) => {
  const date = dayjs(dateString);

  if (date.isToday()) {
    return "Today";
  } else if (date.isYesterday()) {
    return "Yesterday";
  } else if (dayjs().diff(date, "day") < 7) {
    return date.format("dddd"); // Show the day name (e.g., "Saturday")
  } else {
    return date.format("MMMM D, YYYY"); // Show full date (e.g., "February 10, 2025")
  }
};

export const formatMessageDate = (dateString: string): string => {
  const date = dayjs(dateString);
  const now = dayjs();

  if (date.isSame(now, "day")) {
    // If today, show time in 12-hour format with AM/PM
    return date.format("hh:mm A");
  } else if (date.isSame(now.subtract(1, "day"), "day")) {
    // If yesterday, show 'Yesterday'
    return "Yesterday";
  } else {
    // Otherwise, show the day name (e.g., "Monday")
    return date.format("dddd");
  }
};
