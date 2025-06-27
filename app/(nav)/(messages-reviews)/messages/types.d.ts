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
