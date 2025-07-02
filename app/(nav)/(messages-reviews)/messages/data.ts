import { empty } from "@/app/config";
import {
  CompanyUsersAPIResponse,
  ConversationsAPIResponse,
  PageMessages,
  UsersProps,
} from "./types";
import api, { handleAxiosError } from "@/services/api";
import moment from "moment";
import {
  AudioIcon,
  CancelIcon,
  ChevronLeft,
  DocumentIcon,
  EmojiIcon,
  GalleryIcon,
} from "@/public/icons/icons";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { capitalizeWords } from "@/hooks/capitalize-words";

export const users_data: UsersProps[] = [
  { id: "1", name: "", imageUrl: "", position: "" },
];

export const initialData = {
  users: users_data,
  filters: {
    roles: {
      director: 0,
      staff: 0,
      account: 0,
      manager: 0,
    },
    branches: [{ id: 0, name: "" }],
  },
};

export interface MessageUserPageTypes {
  users: UsersProps[];
  filters: {
    roles: {
      director: number;
      staff: number;
      account: number;
      manager: number;
    };
    branches: {
      id: number;
      name: string;
    }[];
  };
}

export const transformCompanyUsersData = (
  res: CompanyUsersAPIResponse
): MessageUserPageTypes => {
  // console.log("transformCompanyUsersData", res);
  return {
    users: res.data.users.map((u) => ({
      id: u.id,
      staff_id: u.staff_id,
      branch_id: u.branch_id,
      name: u.name,
      imageUrl: u.profile_picture || empty,
      position: u.role,
      tier: u.tier,
      title: u.title,
      // badgeColor: tierColorMap[u.user_tier as keyof typeof tierColorMap],
      online_status: u.online_status,
    })),
    filters: {
      roles: {
        director: res.data.filters.roles.director,
        staff: res.data.filters.roles.staff,
        account: res.data.filters.roles.account,
        manager: res.data.filters.roles.manager,
      },
      branches: res.data.filters.branches,
    },
  };
};

export const transformUsersMessages = (
  data: ConversationsAPIResponse | null | undefined
): PageMessages[] => {
  // console.log("data got", data);
  if (!data || !data.conversations) return []; // Ensure data exists

  return data.conversations.map((c) => {
    let finalContentType = "text"; // Default to 'text'

    // if (c.latest_message_type !== "text") {
    //   // If it's a file, check the file extension.
    //   const extension = c.latest_message.split(".").pop()?.toLowerCase() || "";
    if (
      c.latest_message_type !== "text" &&
      typeof c.latest_message === "string"
    ) {
      const extension = c.latest_message.split(".").pop()?.toLowerCase() || "";
      if (["mp3", "wav", "ogg", "webm"].includes(extension)) {
        finalContentType = "audio";
      } else if (["mp4", "avi", "mov"].includes(extension)) {
        finalContentType = "video";
      } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
        finalContentType = "image";
      } else if (["pdf", "doc", "docx", "txt"].includes(extension)) {
        finalContentType = "document";
      } else {
        // Fallback for unrecognized file types.
        finalContentType = "file";
      }
    }

    return {
      id: c.id,
      pfp: c.avatar,
      desc: c.latest_message,
      time: c.latest_message_time,
      fullname: `${c.title ?? ""} ${capitalizeWords(c.name)}`,
      messages: c.unread_count,
      verified: false, // change later
      content_type: finalContentType,
      role: c.role,
      tier: c.tier,
      title: c.title,
      type: c.type,
      unread_count: c.unread_count,
      online: c.is_online === "online",
      last_seen: c.is_online,
      // badgeColor logic:
      // - For "director", "account", "staff", "manager": only if tier === 2
      // - For other roles: if tier exists, use tierColorMap
      // - Else: undefined
      badgeColor: (() => {
        const specialRoles = ["director", "account", "staff", "manager"];
        if (c.type?.toLowerCase() === "group") return undefined; // no badge for group chat
        if (specialRoles.includes(c.role)) {
          return c.tier === 2 ? tierColorMap[2] : undefined;
        }
        return c.tier
          ? tierColorMap[c.tier as keyof typeof tierColorMap]
          : undefined;
      })(),
    };
  });
};

export const sumUnreadCount = (data: any[]) =>
  data.reduce((total, item) => total + item.unread_count, 0);

// export const roundUptoNine = (num: number): string => (num > 9 ? "9+" : num.toString());
export const roundUptoNine = (num: number): string => {
  if (Number.isNaN(num)) return "0"; // or another fallback value
  return num > 9 ? "9+" : num.toString();
};

// export const formatMessageText = (message: string) => {
//   return message.replace(/(?:\r\n|\r|\n)/g, "<br />");
// };

export const formatMessageText = (
  message: string | undefined | null
): string => {
  if (!message || typeof message !== "string") {
    return "";
  }
  return message.replace(/(?:\r\n|\r|\n)/g, "<br />");
};

type IconComponent = () => JSX.Element;
export const getIconByContentType = (contentType: string) => {
  const iconMap: Record<string, IconComponent | null> = {
    audio: AudioIcon,
    video: GalleryIcon,
    image: GalleryIcon,
    document: DocumentIcon,
  };
  if (contentType === "text" || !iconMap[contentType]) {
    return null;
  }
  return iconMap[contentType];
};

export const transformMessages = (data: any) => {
  if (!data) return [];
  return data
    .map((d: any) => ({
      id: d.id,
      details: [
        {
          text: d.content,
          sender_id: Number(d.sender_id),
          time: moment(d.timestamp).format("hh:mm A"),
        },
      ],
      day: moment(d.timestamp).calendar(),
      // Include a numeric timestamp for sorting
      timestamp: new Date(d.timestamp).getTime(),
    }))
    .sort((a: any, b: any) => a.timestamp - b.timestamp);
};

// interface Message {
//   id: number;
//   text: string | null;
//   senderId: number;
//   timestamp: string;
//   content_type: string;
// }

interface GroupedMessage {
  id: number;
  text: string | null;
  sender_id: number;
  time: string;
  content_type: string;
  seen: boolean;
}

export interface NormalizedMessage {
  id: number;
  text: string | null;
  senderId: number;
  timestamp: string;
  content_type: string;
  sender?: {
    fullname: string;
    picture: string;
    title: string;
  };
}

export interface Message {
  id: number;
  text: string | null;
  senderId: number;
  timestamp: string;
  content_type: string;
  sender?: {
    fullname: string;
    picture: string;
    title: string;
  };
}



interface GroupedMessage {
  id: number;
  text: string | null;
  sender_id: number;
  time: string;
  content_type: string;
  seen: boolean;
  sender: {
    fullname?: string;
    picture?: string;
    title?: string;
  };
}


export type GroupChatAPIResponse = {
  group_chat: any;
  messages: any[];
  unread_count: number;
  pusher: any;
};

export type DirectChatAPIResponse = {
  status: string;
  messages: any[];
};

// export const transformMessagesFromAPI = (
//   apiData: GroupChatAPIResponse | DirectChatAPIResponse,
//   isGroupChat: boolean
// ): NormalizedMessage[] => {
//   let messagesRaw: any[] = [];

//   if (isGroupChat && "messages" in apiData) {
//     messagesRaw = apiData.messages;
//   } else if (!isGroupChat && "messages" in apiData) {
//     messagesRaw = apiData.messages;
//   }

//   return messagesRaw.map((msg) => {
//     const timestamp =
//       isGroupChat && msg.created_at
//         ? moment(msg.created_at).format("YYYY-MM-DD HH:mm:ss")
//         : msg.date && msg.timestamp
//         ? moment(`${msg.date} ${msg.timestamp}`).format("YYYY-MM-DD HH:mm:ss")
//         : "";
//     // Sender info for group chat
//     const sender =
//       isGroupChat && msg.sender
//         ? {
//             fullname: msg.sender.name ?? "",
//             picture: msg.sender.profile?.picture ?? empty,
//             title: msg.sender.profile?.title ?? "",
//           }
//         : undefined;

//     return {
//       id: msg.id,
//       text: msg.content ?? null,
//       senderId: msg.sender_id,
//       timestamp,
//       content_type: msg.content_type,
//       sender,
//     } as NormalizedMessage;
//   });
// };

export const transformMessagesFromAPI = (
  apiData: GroupChatAPIResponse | DirectChatAPIResponse,
  isGroupChat: boolean
): NormalizedMessage[] => {
  let messagesRaw: any[] = [];
  if ("messages" in apiData) messagesRaw = apiData.messages;

  return messagesRaw.map((msg) => {
    // Determine timestamp
    const timestamp =
      isGroupChat && msg.created_at
        ? moment(msg.created_at).format("YYYY-MM-DD HH:mm:ss")
        : msg.date && msg.timestamp
        ? moment(`${msg.date} ${msg.timestamp}`).format("YYYY-MM-DD HH:mm:ss")
        : "";

    // Determine content_type
    let content_type = "text";
    if (
      msg.content_type &&
      msg.content_type !== "text" &&
      typeof msg.content === "string"
    ) {
      content_type = getContentTypeFromExtension(msg.content);
    } else if (msg.content_type && msg.content_type !== "text") {
      // fallback to api content_type
      content_type = msg.content_type;
    }

    // Sender info for group chat
    const sender =
      isGroupChat && msg.sender
        ? {
            fullname: msg.sender.name ?? "",
            picture: msg.sender.profile?.picture ?? empty,
            title: msg.sender.profile?.title ?? "",
          }
        : undefined;

    return {
      id: msg.id,
      text: msg.content ?? null,
      senderId: Number(msg.sender_id), 
      timestamp,
      content_type,
      sender,
    } as NormalizedMessage;
  });
};

export function isDirectChatResponse(obj: any): obj is DirectChatAPIResponse {
  return (
    !!obj &&
    typeof obj === "object" &&
    "status" in obj &&
    Array.isArray(obj.messages)
  );
}

export function isGroupChatResponse(obj: any): obj is GroupChatAPIResponse {
  return (
    !!obj &&
    typeof obj === "object" &&
    "group_chat" in obj &&
    Array.isArray(obj.messages)
  );
}

export const groupMessagesByDay = (
  data: Message[]
): { day: string; messages: GroupedMessage[] }[] => {
  // console.log("groupMessagesByDay input:", data);
  if (!data || !data.length) return [];

  // Sort messages by timestamp
  const sorted = [...data].sort(
    (a, b) =>
      moment(a.timestamp, "YYYY-MM-DD hh:mm A").valueOf() -
      moment(b.timestamp, "YYYY-MM-DD hh:mm A").valueOf()
  );

  // Group by day
  const groups = sorted.reduce((acc, message) => {
    const dayKey = moment(message.timestamp, "YYYY-MM-DD hh:mm A").format(
      "YYYY-MM-DD"
    );
    const displayDay = moment(message.timestamp, "YYYY-MM-DD hh:mm A").format(
      "MMMM D, YYYY"
    );

    if (!acc[dayKey]) {
      acc[dayKey] = { day: displayDay, messages: [] };
    }

    acc[dayKey].messages.push({
      id: message.id,
      text: message.text,
      sender_id: message.senderId,
      time: moment(message.timestamp, "YYYY-MM-DD hh:mm A").format("hh:mm A"),
      content_type: message.content_type,
      seen: false,
      sender: {
        fullname: message.sender?.fullname ?? "",
        picture: message.sender?.picture ?? empty,
        title: message.sender?.title ?? "",
      },
    });

    return acc;
  }, {} as Record<string, { day: string; messages: GroupedMessage[] }>);

  const result = Object.values(groups);
  return result;
};

// Helper to infer content type from file extension
export const getContentTypeFromExtension = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  if (["mp3", "wav", "ogg", "webm"].includes(ext)) return "audio";
  if (["mp4", "avi", "mov", "webm"].includes(ext)) return "video";
  if (["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext))
    return "image";
  if (["pdf", "doc", "docx", "txt", "xls", "xlsx", "ppt", "pptx"].includes(ext))
    return "document";
  if (ext) return "file";
  return "text";
};

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Keep existing SendMessage, transform functions
// export const SendMessage = async (payload: FormData, id: string) => {
//   try {
//     const response = await api.post(`/messages/${id}`, payload);
//     console.log("SendMessage response:", response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error("SendMessage error:", error.response?.data || error.message);
//     throw error;
//   }
// };

// export const groupMessagesByDay = (data: any[]) => {
//   // console.log("data", data)
//   if (!data || !data.length) return [];

//   // Sort messages by timestamp in ascending order.
//   const sorted = [...data].sort(
//     (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
//   );

//   // Reduce the sorted messages into groups based on day.
//   const groups = sorted.reduce((acc, message) => {
//     // Use 'YYYY-MM-DD' for grouping.
//     const dayKey = moment(message.timestamp).format("YYYY-MM-DD");
//     // Use calendar format for display (e.g., "Today", "Yesterday", etc.).
//     const displayDay = moment(message.timestamp).calendar();

//     if (!acc[dayKey]) {
//       acc[dayKey] = { day: displayDay, messages: [] };
//     }

//     // Determine the appropriate content type.
//     let finalContentType = message.content_type;
//     let contentDisplay = message.content;

//     if (message.content_type !== "text") {
//       // If it's a file, check the file extension.
//       if (message.content_type === "file") {
//         const extension = message.content.split(".").pop()?.toLowerCase() || "";
//         if (["mp3", "wav", "ogg"].includes(extension)) {
//           finalContentType = "audio";
//         } else if (["mp4", "webm", "avi", "mov"].includes(extension)) {
//           finalContentType = "video";
//         } else if (["jpg", "jpeg", "png", "gif", "bmp"].includes(extension)) {
//           finalContentType = "image";
//         } else if (["pdf", "doc", "docx", "txt"].includes(extension)) {
//           finalContentType = "document";
//         } else {
//           // Fallback for unrecognized file types.
//           finalContentType = "file";
//         }
//       }
//     }

//     // Push the transformed message details.
//     acc[dayKey].messages.push({
//       id: message.id,
//       text: contentDisplay,
//       sender_id: Number(message.sender_id),
//       time: moment(message.timestamp).format("hh:mm A"),
//       content_type: finalContentType,
//       seen: message.read_at,
//     });

//     return acc;
//   }, {} as Record<string, { day: string; messages: any[] }>);

//   // Convert the groups object into an array.
//   return Object.values(groups);
// };

export const positionMap: Record<string, string> = {
  "Branch Manager": "manager",
  "Account Officer": "account",
  Staff: "staff",
  Director: "director",
  "Landlord/Landlady": "landlord",
  "Tenant/Occupants": "tenant",
  "Service Provider": "provider",
};

// /messages/conversation/8/send
export const SendMessage = async (data: FormData, id: string) => {
  try {
    const res = await api.post(`/messages/${id}/send`, data);
    if (res.status === 200 || res.status === 201) {
      // console.log("response", res)
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};

// /group-chats/1/messages
export const SendGroupMessage = async (data: FormData, id: string) => {
  try {
    const res = await api.post(`/group-chats/${id}/messages`, data);
    if (res.status === 200 || res.status === 201) {
      return true;
    }
  } catch (err) {
    handleAxiosError(err);
    return false;
  }
};

// Helper to convert audio to FormData
export const convertToFormData = (audioBlob: Blob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "voice-note.wav");
  formData.append("content_type", "audio");
  formData.append("receiver_type", "user");
  return formData;
};
