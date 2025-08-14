import dayjs from "dayjs";
import {
  TeamChatResponseData,
  TeamChatUsersResponse,
  UsersResponse,
} from "./types";

export interface IMemberList {
  members: {
    id: number;
    username: string;
    profile_picture: string;
    role: string;
  }[];
}


export const transformTeamMemberData = (
  data: TeamChatUsersResponse
): IMemberList => {
  return {
    members: data.data.users.map((member) => ({
      id: member.id,
      username: member.name?.toLowerCase(),
      profile_picture: member.profile_picture,
      role: member.role,
    })),
  };
};

export interface IGroupChatCard {
  group_count: number;
  team: {
    id: string;
    pfp: string | null;
    desc: string;
    time: string;
    fullname: string;
    verified: boolean;
    messages: number;
    content_type: string;
    tier: number;
    title: string;
    role: string;
  }[];
}

export const transformGroupChatListData = (
  res: TeamChatResponseData
): IGroupChatCard => {
  const { data } = res;
  return {
    group_count: data?.group_count,
    team: data.groups.map((item) => {
      let contentType = "text"; // Default to 'text'
      const desc = item?.latest_message ? item?.latest_message?.content : "";
      if (
        item?.latest_message?.content_type !== "text" &&
        typeof desc === "string"
      ) {
        const extension = desc.split(".").pop()?.toLowerCase() || "";
        if (["mp3", "wav", "ogg", "webm"].includes(extension)) {
          contentType = "audio";
        } else if (["mp4", "avi", "mov"].includes(extension)) {
          contentType = "video";
        } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
          contentType = "image";
        } else if (["pdf", "doc", "docx", "txt"].includes(extension)) {
          contentType = "document";
        } else {
          contentType = "text";
        }
      }
      return {
        id: item?.id.toString(),
        pfp: item?.picture,
        desc,
        time: item?.latest_message
          ? dayjs(item?.latest_message?.sent_at).format("hh:mmA")
          : "",
        fullname: item?.name,
        verified: false,
        messages: item?.unread_count,
        content_type: contentType,
        tier: 1,
        title: "",
        role: "",
      };
    }),
  };
};
