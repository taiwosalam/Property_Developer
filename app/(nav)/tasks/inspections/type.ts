import { StaticImageData } from "next/image";

export type PropertyListResponse = {
  status: "success";
  message: string;
  data: Property[];
};


export type InspectionDataApiResponse = {
  total_inspections: number;
  total_months: number;
  total_physical: number;
  total_physical_month: number;
  total_virtual: number;
  total_virtual_month: number;
  inspections: Inspection[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};
type InspectionData = {
  id: number;
  inspection_type: "virtual_inspection" | "physical_inspection";
  inspection_date: string;
  inspection_time: string;
  description: string;
  booked_by: string;
  tier: number;
  booked_by_id: number;
  phone: string;
  unit: Unit;
  unit_image: Image[];
  branch: string;
  property_name: string;
  property_images: Image[];
  full_address: string;
  state: string;
  local_government: string;
  city_area: string;
  created_at: string;
};
export type InspectionDetailsApiResponse = {
 status: string;
 data: InspectionData;
};

export type Inspection = {
  id: number;
  inspection_type: "physical_inspection" | "virtual_inspection";
  inspection_date: string;
  inspection_time: string;
  tier: number;
  description: string;
  booked_by: string;
  image: string | null;
  booked_by_id: number;
  phone: string;
  unit: Unit;
  unit_image: Image[];
  property_name: string;
  full_address: string;
  state: string;
  local_government: string;
  city_area: string;
  created_at: string;
};

type Property = {
  id: number;
  video_link: string | null;
  title: string;
  state: string;
  local_government: string;
  city_area: string;
  full_address: string;
  category: string;
  description: string;
  property_type: string;
  branch_id: number;
  inventory_id: number | null;
  landlord_id: number | null;
  user_id: number;
  company_id: number;
  agency_fee: number;
  who_to_charge_new_tenant: string | null;
  who_to_charge_renew_tenant: string | null;
  caution_deposit: string | null;
  group_chat: number;
  rent_penalty: number;
  fee_penalty: number;
  request_call_back: number;
  book_visitors: number;
  vehicle_record: number;
  active_vat: number;
  currency: string | null;
  coordinate: string | null;
  management_fee: number;
  fee_period: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  branch: Branch;
  units: [];
};

type Branch = {
  id: number;
  company_id: number;
  manager_id: number | null;
  has_wallet: number;
  branch_name: string;
  is_active: number;
  picture: string;
  state: string;
  local_government: string;
  city: string;
  branch_desc: string;
  branch_address: string;
  email: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

type Image = {
  id: number;
  path: string;
  is_default: number;
  mediaable_type: string;
  mediaable_id: number;
  created_at: string;
  updated_at: string;
};

type Unit = {
  id: number;
  user_id: number;
  property_id: number;
  tenant_id: number | null;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string;
  unit_preference: string;
  measurement: string;
  images: Image[];
  bedroom: string;
  bathroom: string;
  toilet: number;
  facilities: string | null;
  en_suit: number;
  prepaid: number;
  wardrobe: number;
  pet_allowed: number;
  total_area_sqm: string;
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
  property: Property;
};

type TImage = {
  src: string | StaticImageData;
  isVideo?: boolean;
};

export interface InspectionPageType {
  total_inspections: number;
  total_months: number;
  total_physical: number;
  total_physical_month: number;
  total_virtual: number;
  total_virtual_month: number;
  total_page: number;
  current_page: number;
  card: {
    id: number;
    property_id: number;
    property_name: string;
    tier: number;
    total_package: string;
    fee_amount: string;
    unit_fee_amount: string;
    images: TImage[];
    address: string;
    inspection_type: "virtual_inspection" | "physical_inspection";
    booked_by: string;
    inspection_date: string;
    inspection_time: string;
  }[];
}
