

interface Profile {
    id: number;
    user_id: number;
    type: string;
    name: string | null;
    email: string | null;
    phone: string | null;
    nin: string | null;
    bvn: string | null;
    picture: string | null;
    title: string | null;
    gender: string | null;
    address: string | null;
    state: string | null;
    lga: string | null;
    city: string | null;
    bio: string | null;
    dob: string | null;
    religion: string | null;
    marital_status: string | null;
    occupation: string | null;
    job_type: string | null;
    family_type: string | null;
    note: string | null;
    facebook: string | null;
    x: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    tiktok: string | null;
    website: string | null;
    bvn_link_at: string | null;
    created_at: string;
    updated_at: string;
  }
  
  interface Pivot {
    group_chat_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
  }
  
  interface User {
    id: number;
    encodedId: string;
    name: string;
    email: string;
    phone: string | null;
    username: string | null;
    referrer_code: string | null;
    email_verified_at: string;
    phone_verified_at: string | null;
    username_updated_at: string | null;
    is_active: number;
    is_company_owner: number;
    tier_id: number;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
    provider_id: string | null;
    provider_name: string | null;
    pivot: Pivot;
    profile?: Profile;
  }
  
  interface GroupChat {
    id: number;
    name: string;
    is_active: number;
    created_by: number;
    description: string;
    picture: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    users: User[];
    admins: User[];
    chats: any[]; // Assuming the chat structure is undefined
  }
  
  interface GroupChatResponse {
    group_chat: GroupChat;
    messages: any[]; // Assuming message structure is undefined
  }
  

  export type ChatMessage = {
    id: number;
    group_chat_id: number;
    sender_id: number;
    message: string;
    reply_to: number | null;
    created_at: string; // ISO timestamp
    updated_at: string; // ISO timestamp
  };
  
  export type ChatMessages = ChatMessage[];
  