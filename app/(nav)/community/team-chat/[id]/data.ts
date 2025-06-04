import { empty } from "@/app/config";
import { GroupChatDetailsResponse } from "./types";
import dayjs from "dayjs";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export interface IChatDetailsPage {
  about: {
    id: number;
    group_name: string;
    description: string;
    created_at: string;
    total_members: number;
    total_active: number;
    picture: string | null;
  };
  group_members: {
    id: number;
    picture: string | null;
    fullname: string;
    role: string;
  }[];
}
export const transformTeamDetails = (
  data: GroupChatDetailsResponse
): IChatDetailsPage => {
  return {
    about: {
      id: data?.group_chat?.id,
      group_name: data?.group_chat?.name,
      description: data?.group_chat?.description,
      created_at: data?.group_chat?.created_at
        ? dayjs(data?.group_chat?.created_at).format("DD/MM/YYYY hh:mmA")
        : "___ ___",
      total_members: data?.group_chat.users.length,
      total_active: 30,
      picture: data?.group_chat?.picture || null,
    },
    group_members: data?.group_chat.users.map((user) => ({
      id: user.id,
      picture: user.profile?.picture || null,
      fullname: user?.name,
      role: "director",
    })),
  };
};

export const sendTeamMessage = async (groupId: string, message: any, type: string) => {
  const payload = {
    content_type: type,
    content: message,
  };
  try {
    const res = await api.post(
      `/group-chats/${groupId}/messages`,
      payload
    );
    if (res.status === 200 || res.status === 201) {
      toast.success("Message sent!");
      window.dispatchEvent(new Event("refetchTeam"));
      return true;
    }
  } catch (error) {
    console.log(error);
    handleAxiosError(error);
    return false;
  }
};
