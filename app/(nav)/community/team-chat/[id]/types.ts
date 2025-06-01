export type GroupChatDetailsResponse = {
  group_chat: GroupChat;
  messages: Message[];
  unread_count: number;
  pusher: PusherConfig;
};

type GroupChat = {
  id: number;
  name: string;
  slug: string;
  uuid: string;
  is_active: boolean;
  is_private: boolean;
  created_by: number;
  description: string;
  picture: string | null;
  settings: {
    allow_invites: boolean;
    member_privacy: 'members' | string;
    message_permissions: 'all' | string;
  };
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  users: GroupChatUser[];
  admins: Admin[];
  chats: Chat[];
  latest_message: Message | null;
};

type GroupChatUser = {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
  pivot: Pivot;
  profile: {
    picture: string | null;
    user_id: number;
    bvn_linked: boolean;
  };
};

type Admin = {
  id: number;
  name: string;
  is_verified: boolean;
  pivot: Pivot;
};

type Pivot = {
  group_chat_id: number;
  user_id: number;
  role: 'admin' | 'member' | string;
  joined_at: string;
  muted_until: string | null;
  is_banned: number;
  added_by: number;
  created_at: string;
  updated_at: string;
};

type Chat = any; // Empty array, define later when chat structure is known

type Message = any; // Empty array and latest_message is null, define later when message structure is known

type PusherConfig = {
  key: string;
  cluster: string;
  auth_endpoint: string;
  options: {
    encrypted: boolean;
    useTLS: boolean;
  };
};
