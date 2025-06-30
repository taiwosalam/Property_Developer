import { Currency } from "@/utils/number-formatter";

export interface StaffProperty {
  address: string;
  isClickable: boolean;
  id: string;
  images: string[];
  property_name: string;
  total_units: number;
  total_returns: number;
  total_income: number;
  total_unit_pictures: number;
  hasVideo: boolean;
  property_type: "rental" | "facility";
  currency: Currency;
}

export interface IStaffData {
  name: string;
  role: string;
}

export interface StaffPropertyPagination {
  current_page: number;
  total_page: number;
}

export interface StaffPropertyPageData {
  properties: StaffProperty[];
  pagination: StaffPropertyPagination;
  staff: IStaffData;
}

export interface StaffPropertiesApiResponse {
  status: string;
  statusCode: number;
  message: string;
  data: StaffData;
  activities: StaffActivity[];
  messages: StaffMessage[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
    per_page: number;
  };
}

export interface StaffData {
  id: number;
  title?: string | null;
  professional_title?: string | null;
  years_experience?: number | null;
  name: string;
  email: string;
  phone: string;
  username?: string | null;
  gender?: string | null;
  position?: string | null;
  state?: string | null;
  local_government?: string | null;
  address?: string | null;
  picture?: string | null;
  tier_id?: number | null;
  tier_description?: string | null;
  user_id?: number | null;
  status: string;
  online_status: string;
  branch_id?: number | null;
  company_id?: number | null;
  company_verification: boolean;
  created_at: string;
  updated_at: string;
  about_staff?: string | null;
  landlords: {
    data: StaffLandlord[];
    pagination: StaffPagination;
  };
  properties: {
    data: ResStaffProperty[];
    pagination: StaffPagination;
  };
  tenants: {
    data: StaffTenant[];
    pagination: StaffPagination;
  };
}

export interface StaffLandlord {
  id: number;
  user_id?: number | null;
  name: string;
  email: string;
  phone: string;
  picture: string;
  user_tier?: number | null;
}

export interface StaffTenant {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  picture: string;
  user_tier: number;
}

export interface StaffPagination {
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
}

export interface StaffPropertyImage {
  id: number;
  path: string;
}

export interface StaffPropertyUnit {
  id: number;
  user_id: number;
  property_id: number;
  tenant_id: number | null;
  unit_name: string;
  unit_type: string;
  unit_sub_type?: string | null;
  unit_preference?: string | null;
  measurement?: string | null;
  bedroom?: string | null;
  bathroom?: string | null;
  toilet?: number | null;
  facilities?: string[] | null;
  en_suit?: boolean;
  prepaid?: boolean;
  wardrobe?: boolean;
  pet_allowed?: boolean;
  total_area_sqm?: string | null;
  number_of?: string | null;
  fee_period: string;
  fee_amount: string;
  vat_amount: string;
  security_fee: string;
  service_charge: string;
  agency_fee: string;
  legal_fee: string;
  caution_fee: string;
  inspection_fee: string;
  management_fee?: string | null;
  other_charge: string;
  negotiation: boolean;
  total_package: string;
  renew_fee_period: string;
  renew_fee_amount: string;
  renew_vat_amount: string;
  renew_service_charge: string;
  renew_other_charge: string;
  renew_total_package: string;
  renew_agency_fee: string;
  renew_security_fee: string;
  renew_legal_fee?: string | null;
  renew_caution_fee?: string | null;
  renew_inspection_fee?: string | null;
  renew_management_fee?: string | null;
  is_active: string;
  published: boolean;
  status: string;
  reject_reason?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

export interface ResStaffProperty {
  id: number;
  name: string;
  description?: string | null;
  state: string;
  local_government: string;
  city_area: string;
  full_address: string;
  currency: Currency;
  branch: string;
  property_type: "rental" | "facility";
  agency_fee: number;
  management_fee: number;
  last_updated: string;
  category: string;
  mobile_tenant: number;
  web_tenant: number;
  total_unit: number;
  available_unit: number;
  account_officer?: string | null;
  unit: StaffPropertyUnit[];
  images: StaffPropertyImage[];
}

export interface StaffActivity {
  "S/N": number;
  username: string;
  page_visits: string;
  action_taken: string;
  ip_address: string;
  location: {
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  date: string;
  time: string;
}

export interface StaffMessage {
  participant_id: number;
  participant_role: string;
  participant_title: string;
  participant_tier: number;
  participant_name: string;
  participant_onlineStatus: string;
  profile_picture: string;
  unread_count: number;
  latest_message: string;
  latest_message_type: string;
  latest_message_time: string;
  messages: {
    id: number;
    sender_id: number;
    receiver_id: number;
    content: string;
    content_type: string;
    read_at: string | null;
    created_at: string;
  }[];
}
