import { BadgeIconColors } from "../BadgeIcon/badge-icon";

export interface MessageCardProps {
  id: string;
  pfp: string | null;
  desc: string;
  time: string;
  fullname: string;
  messages?: number;
  verified?: boolean;
  online?: boolean;
  highlight?: boolean;
  groupDesc?: string;
  onClick?: () => void;
  content_type?: string;
  last_seen?: string;
  badgeColor?: BadgeIconColors;
  tier?: number;
  title?: string;
  role?: string;
  type?: string;
}

export interface MessagesProps {
  day?: string;
  messages?: any[];
  userId?: string | number;
  noScroll?: boolean;
  chat_type?: "group" | "private";
}

export interface MessageProps {
  text: string;
  seen: string;
  time: string;
  content_type?: string;
  type: "to user" | "from user";
  noScroll?: boolean;
  chat_type?: "group" | "private";
  showSenderInfo?: boolean 
  sender?: {
    fullname?: string;
    picture?: string;
    title?: string;
  };
}

export interface UserDetailsResponse {
  status: string;
  message: string;
  data: UserDetails;
}

export interface UserDetails {
  id: number;
  encodedId: string;
  name: string;
  email: string;
  phone: string;
  username: string | null;
  referrer_code: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  username_updated_at: string | null;
  is_active: boolean;
  is_company_owner: boolean;
  tier_id: number;
  last_seen: string | null;
  provider_id: string | null;
  provider_name: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  is_verified: boolean;
  unread_messages_count: number;
  unread_notifications_count: number;
  profile_completion_status: string;
  is_subscription_expired: boolean;
  current_plan: string;
  current_subscription_expiry: string;
  tier: Tier;
  profile: UserProfile;
  next_of_kin: any;
  guarantors: any[];
  application: any;
  identity: any;
  roles: UserRole[];
  director: {
    profile_picture: string | null;
  };
}

export interface Tier {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface UserProfile {
  id: number;
  user_id: number;
  type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  picture: string | null;
  background_image: string | null;
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
  facebook: string | null;
  x: string | null;
  instagram: string | null;
  linkedin: string | null;
  youtube: string | null;
  tiktok: string | null;
  website: string | null;
  note: string | null;
  bvn_link_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  bvn_linked: boolean;
  completion_status: string;
  flag: string | null;
}

export interface UserRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: RolePivot;
}

export interface RolePivot {
  model_type: string;
  model_id: number;
  role_id: number;
}
