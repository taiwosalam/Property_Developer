export interface MessagesLayoutProps {
  children: React.ReactNode;
}

type User = {
  id: number;
  name: string;
  profile_picture: string;
  email: string;
  profile: {
    picture: string
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

type UsersResponse = {
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
