export interface MessagesLayoutProps {
  children: React.ReactNode;
}

type User = {
  id: number;
  name: string;
  profile_picture: string;
  email: string;
  profile: {
    picture: string;
  };
  role: string;
  branch: string;
  branch_id: string | number;
  staff_id: number | null;
};

type RoleFilters = {
  director: number;
  account: number;
  manager: number;
  staff: number;
};

type Branch = {
  id: number;
  name: string;
};

type Filters = {
  roles: RoleFilters;
  branches: Branch[];
  branch_count: number;
};

export type TeamChatUsersResponse = {
  message: string;
  status: "success" | "error";
  data: {
    users: User[];
    filters: Filters;
  };
};

type User = {
  id: number;
  name: string;
  profile_picture: string;
  role: string;
  branch: string;
  branch_id: string | number;
  staff_id: number | null;
};

type RoleFilters = {
  director: number;
  account: number;
  manager: number;
  staff: number;
};

type Branch = {
  id: number;
  name: string;
};

type Filters = {
  roles: RoleFilters;
  branches: Branch[];
  branch_count: number;
};

type UsersResponse = {
  message: string;
  status: "success" | "error";
  data: {
    users: User[];
    filters: Filters;
  };
};

type Group = {
  group_id: number;
  group_name: string;
  group_description: string;
  group_picture: string | null;
  latest_message: {
    content: string;
    content_type: string;
    sender: string;
    timestamp: string;
  };
  unread_message_count: number;
};

type GroupsResponse = {
  group_count: number;
  groups: Group[];
};

interface GroupChat {
  id: number;
  users: Users[];
  chats: MessageChats;
  name: string;
  description: string;
  created_by: number;
  picture: string;
  updated_at: string; // ISO timestamp
  created_at: string; // ISO timestamp
}
type Message = {
  id: number;
  group_chat_id: number;
  sender_id: number;
  message: string;
  reply_to: number | null;
  created_at: string; // ISO timestamp
  updated_at: string; // ISO timestamp
};

type Messages = Message[];

type MessageChat = {
  id: number;
  group_chat_id: number;
  sender_id: number;
  content: string;
  content_type: string; // Extend with more content types if needed
  reply_to: number | null;
  created_at: string; // ISO timestamp format
  updated_at: string;
};

type MessageChats = MessageChat[];
interface GroupChatResponse {
  messages: Messages;
  chats: MessageChat[];
  users: [];
  group_chat: GroupChat;
}

export type TeamChatResponseData = {
  success: boolean;
  data: {
    group_count: number;
    groups: GroupData[];
    total_unread: number;
  };
  pusher_config: {
    key: string;
    cluster: string;
    auth_endpoint: string;
    options: {
      encrypted: boolean;
      useTLS: boolean;
    };
  };
  meta: {
    total_groups: number;
    timestamp: string; // ISO datetime string
  };
};

type GroupData = {
  id: number;
  uuid: string;
  name: string;
  picture: string | null;
  description: string;
  unread_count: number;
  latest_message: MessageData[] | null;
  members: {
    count: number;
    list: Member[];
  };
  total_messages: number;
  user_role: "admin" | "member" | string; // add more roles if needed
  privacy: "private" | "public" | string;
  realtime_channel: string;
  created_at: string; // ISO datetime string
};

type MessageData = {
  id: string;
  content: string;
  time: string;
  content_type: string;
  // define this if you expect structure for latest_message in the future
  // example:
  // id: number;
  // content: string;
  // sender_id: number;
  // timestamp: string;
};

type Member = {
  id: number;
  name: string;
};
