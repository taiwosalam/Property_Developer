import { messageUserDataTypes } from "@/app/(nav)/management/landlord/types";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { StaffProfilePortfolioProps } from "@/components/Management/Staff-And-Branches/Branch/StaffProfile/types";

export interface StaffAPIResponse {
  data: {
    id: string;
    title: string;
    real_estate_title: string;
    professional_title: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    gender: string;
    position: string;
    state: string;
    local_government: string;
    address: string;
    picture: string;
    user_id: string;
    branch_id: string;
    company_id: string;
    created_at: string;
    updated_at: string;
    about_staff: string;
    status: string;
    properties: PropertiesRes[];
    landlords: any[];
    tenants: any[];
    tier_id: 1 | 2 | 3 | 4 | 5;
    years_experience: string | number;
    online_status?: "online" | "offline";
    statistic?: any;
  };
  activities: StaffActivitiies[];
  statistic: any;
  messages: {
    participant_id: number;
    participant_type: string;
    participant_name: string;
    participant_onlineStatus: string;
    profile_picture: string | null;
    unread_count: number;
    latest_message: string;
    latest_message_type: string;
    latest_message_time: string;
    messages: {
      id: string | number;
      sender_id: number;
      sender_type: string;
      receiver_id: number;
      receiver_type: string;
      content: string;
      content_type: string;
      read_at: string | null;
      created_at: string;
    }[];
  }[];
}

export interface PropertiesRes {
  id: number;
  video_link: string | null;
  title?: string;
  name: string;
  state: string;
  local_government: string;
  city_area: string;
  full_address: string;
  category: string;
  description: string;
  property_type: string;
  branch_id: string | null;
  inventory_id: string | null;
  land_lord_id: string | null;
  user_id: number;
  company_id: number;
  agency_fee: number;
  who_to_charge_new_tenant: string;
  who_to_charge_renew_tenant: string;
  caution_deposit: string;
  group_chat: number;
  rent_penalty: number;
  fee_penalty: number;
  request_call_back: number;
  book_visitors: number;
  vehicle_record: number;
  active_vat: number;
  currency: string;
  coordinate: string | null;
  management_fee: number;
  fee_period: string | null;
  created_at: string;
  updated_at: string;
  images: {
    path: string;
  }[];
}

export interface StaffActivitiies {
  "S/N"?: number;
  id?: number;
  username: string;
  page_visits: string;
  action_taken: string;
  ip_address: string;
  location: LocationObj;
  date: string;
  time: string;
}

interface LocationObj {
  latitude: number;
  longitude: number;
}

export interface StaffPageTypes {
  staff: {
    id: string;
    title: string;
    real_estate_title: string;
    name: string;
    email: string;
    phone: string;
    username: string;
    gender: string;
    position: string;
    state: string;
    local_government: string;
    address: string;
    picture: string;
    user_id: string;
    branch_id: string;
    company_id: string;
    created_at: string;
    updated_at: string;
    about_staff: any;
    status: string;
    experience: number | string;
    badge_color?: BadgeIconColors;
    online?: boolean;
    statistic?: any;
    isVerified?: boolean;
  };
  activities: StaffActivitiies[];
  chats: [];
  portfolio?: {
    properties: {
      property_name: string;
      image: string[];
      address: string;
    }[];
    landlords: any[];
    tenants: any[];
  };
  messageUserData: messageUserDataTypes;
  chats;
  staffChats: StaffChatTypes[];
}

export interface GroupedMessage {
  id: string;
  text: string;
  sender_id: string;
  time: string;
  content_type: string;
  seen: boolean;
}

export interface GroupedMessages {
  day: string;
  messages: GroupedMessage[];
}
[];

export interface StaffChatTypes {
  pfp: string;
  desc: string;
  time: string;
  fullname: string;
  id: string;
  messages?: number;
  verified?: boolean;
  content_type?: string;
  unread_count?: number;
  online?: boolean;
  last_seen?: string;
  groupedMessages: { day: string; messages: GroupedMessage[] }[];
}[]
