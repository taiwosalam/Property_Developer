export type ApplicationApiResponse = {
  status: "success";
  data: Application[];
};

type Application = {
  id: number;
  user_id: number;
  unit_id: number;
  status: "pending" | "approved" | "rejected" | string;
  application_date: string;
  notes: string | null;
  rejection_reason: string | null;
  cancelled_at: string | null;
  cancelled_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  flagged: boolean;
  flagged_by_others: any[];
  unit: Unit;
  user: User;
};

type Unit = {
  id: number;
  user_id: number;
  property_id: number;
  tenant_id: number | null;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string | null;
  unit_preference: string;
  measurement: string;
  bedroom: string;
  bathroom: string;
  toilet: number;
  facilities: string | null;
  en_suit: number;
  prepaid: number;
  wardrobe: number;
  pet_allowed: number;
  total_area_sqm: number | null;
  number_of: string;
  fee_period: string;
  fee_amount: string;
  vat_amount: string | null;
  security_fee: string;
  service_charge: string;
  agency_fee: string;
  legal_fee: string;
  caution_fee: string;
  inspection_fee: string;
  management_fee: string | null;
  other_charge: string;
  negotiation: number;
  total_package: string;
  renew_fee_period: string | null;
  renew_fee_amount: string;
  renew_vat_amount: string | null;
  renew_service_charge: string;
  renew_other_charge: string;
  renew_total_package: string;
  is_active: string;
  published: number;
  status: string;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

type User = {
  id: number;
  encodedId: string;
  name: string;
  email: string;
  phone: string | null;
  username: string;
  referrer_code: string;
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
  is_verified: boolean;
  profile: UserProfile;
};

type UserProfile = {
  id: number;
  user_id: number;
  type: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  nin: string | null;
  bvn: string | null;
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
  deleted_at: string | null;
  bvn_linked: boolean;
};

export interface IApplicationPageData {
  total_application: number;
  month_application: number;
  mobile_application: number;
  month_mobile_application: number;
  web_application: number;
  month_web_application: number;
  applications: {
    id: number;
    images: string[];
    full_name: string;
    tier_id: number;
    user_id: string;
    user_type: string;
    email: string;
    property_name: string;
    address: string;
    phone_number: string | null;
    date: string;
    total_package: string;
    yearly_amount: string;
    period_type: string;
    currency: string;
  }[];
}

export const transformApplicationData = (
  data: ApplicationApiResponse
): IApplicationPageData => {
  const { data: res } = data;

  return {
    total_application: 0,
    month_application: 0,
    mobile_application: 0,
    month_mobile_application: 0,
    web_application: 0,
    month_web_application: 0,
    applications: res.map((item) => ({
      id: item?.id,
      images: [],
      full_name: item?.user?.name,
      tier_id: item?.user?.tier_id,
      user_id: item?.user?.encodedId,
      user_type: "staff",
      email: item?.user?.email,
      property_name: "2 Bedroom Detached",
      address: "24 Mount Everest",
      phone_number: item?.user?.phone,
      date: item?.application_date,
      total_package: item?.unit?.total_package,
      yearly_amount: item?.unit?.fee_amount,
      period_type: item?.unit?.fee_period,
      currency: "NGN",
    })),
  };
};
