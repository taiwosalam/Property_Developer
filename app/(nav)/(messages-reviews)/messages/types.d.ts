export interface MessagesLayoutProps {
  children: React.ReactNode;
}

export interface UsersProps {
  id: string;
  name: string;
  imageUrl: string;
  position: string;
  status?: string;
  staff_id?: string;
  branch_id?: string;
  online_status?: string;
  title?: string;
  last_seen?: string;
  tier?: number;
}

export interface Conversations {
  participant_id: number;
  participant_type: string;
  participant_name: string;
  profile_picture: string;
  latest_message: string;
  latest_message_time: string;
  unread_count: number;
}

export interface ConversationsAPIResponse {
  Message: string;
  status: string;
  conversations: Conversation[];
}

export interface PageMessages {
  pfp: string;
  desc: string;
  time: string;
  fullname: string;
  id: string;
  messages?: number;
  verified?: boolean;
  content_type?: string;
  unread_count?: number;
  tier: number;
  role: string;
  title: string;
  type?: string;
}
[];

export interface User {
  id: string;
  name: string;
  profile_picture: string | null;
  role: string;
  title: string;
  tier: number;
  staff_id: string;
  branch_id: string;
  online_status: string;
}

export interface RoleFilters {
  director: number;
  staff: number;
  account: number;
  manager: number;
}

export interface Branch {
  id: number;
  name: string;
}

export interface Filters {
  roles: RoleFilters;
  branches: Branch[];
}

export interface CompanyUsersAPIResponse {
  data: {
    users: User[];
    filters: Filters;
  };
}

export type BranchStaff = {
  user: {
    id: number;
    name: string;
  };
};

// ======================================
export interface MessageChat {
  id: number;
  group_chat_id: number;
  content: string;
  user_id: number;
  reply_to: number | null;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    avatar?: string;
  };
}

export interface TeamChatResponseData {
  group_chats: {
    id: number;
    group_name: string;
    description: string;
    created_at: string;
    total_members: number;
    total_active: number;
    picture: string | null;
  }[];
}

export interface GroupChatDetailsResponse {
  group_chat: {
    id: number;
    group_name: string;
    description: string;
    created_at: string;
    total_members: number;
    total_active: number;
    picture: string | null;
    chats: MessageChat[];
  };
}

export interface PageMessages {
  id: string;
  pfp: string; // Updated to string
  desc: string;
  time: string;
  fullname: string;
  verified: boolean;
  messages: number;
  content_type: string;
  tier: number;
  title: string;
  role: string;
  total_members?: number;
  total_active?: number;
  created_at: string;
  members?: {
    id: number;
    picture: string | null;
    fullname: string;
    role: string;
  }[];
}
