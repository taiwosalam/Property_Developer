

export type MaintenanceApiResponse = {
  success: boolean;
  data: {
    current_page: number;
    data: MaintenanceRequest[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  stats: {
    total: number;
    this_month: number;
    by_status: {
      [status: string]: number; // e.g., pending: 5
    };
    by_priority: {
      [priority: string]: number; // e.g., critical: 2, medium: 3
    };
  };
};

type MaintenanceRequest = {
  id: number;
  requested_by: number;
  branch_id: number;
  property_id: number;
  unit_id: number;
  priority: "high" | "critical" | "low" | "very low" | "medium";
  maintenance_type: string;
  service_provider: string;
  unit: string[];
  requester: Requester;
  cost: string;
  quotation: string;
  quotation_type: string;
  status: "not started" | "ongoing" | "completed" | "pending" | "in_progress";
  start_date: string;
  end_date: string;
  completed_at: string | null;
  detail: string;
  announcement: boolean;
  calendar_event: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  property: Property;
  provider: IProvider;
  branch: Branch;
};

interface IProvider {
  id: number;
  name: string;
  company_name: string;
  service_render: string;
}

type Requester = {
  id: number;
  encodedId: string;
  name: string;
  email: string;
  phone: string;
  username: string | null;
  referrer_code: string | null;
  email_verified_at: string;
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
  profile_completion_status: string;
  profile: Profile;
};

type Profile = {
  id: number;
  user_id: number;
  type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  picture: string;
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
};

type Property = {
  id: number;
  branch_id: number;
  inventory_id: number | null;
  landlord_id: number | null;
  user_id: number;
  company_id: number;
  video_link: string | null;
  title: string;
  state: string;
  local_government: string;
  city_area: string;
  full_address: string;
  category: string;
  description: string | null;
  property_type: string;
  agency_fee: number;
  who_to_charge_new_tenant: string | null;
  who_to_charge_renew_tenant: string | null;
  caution_deposit: string | null;
  group_chat: boolean;
  rent_penalty: boolean;
  fee_penalty: boolean;
  request_call_back: boolean;
  book_visitors: boolean;
  vehicle_record: boolean;
  active_vat: boolean;
  currency: string;
  coordinate: string | null;
  management_fee: number;
  fee_period: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  image_count: number;
};

type Unit = {
  id: number;
  user_id: number;
  property_id: number;
  tenant_id: number;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string | null;
  unit_preference: string;
  measurement: string;
  bedroom: string;
  bathroom: string;
  toilet: number;
  facilities: string | null;
  en_suit: boolean;
  prepaid: boolean;
  wardrobe: boolean;
  pet_allowed: boolean;
  total_area_sqm: number | null;
  number_of: string;
  fee_period: string;
  fee_amount: string;
  vat_amount: string;
  security_fee: string;
  service_charge: string;
  agency_fee: string;
  legal_fee: string;
  caution_fee: string;
  inspection_fee: string;
  management_fee: string | null;
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
  renew_legal_fee: string | null;
  renew_caution_fee: string | null;
  renew_inspection_fee: string | null;
  renew_management_fee: string | null;
  is_active: string;
  published: boolean;
  status: string;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type Branch = {
  id: number;
  company_id: number;
  branch_name: string;
  picture: string;
  manager_id: number;
  is_active: boolean;
  has_wallet: boolean;
  state: string;
  local_government: string;
  city: string;
  branch_desc: string;
  branch_address: string;
  email: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};
