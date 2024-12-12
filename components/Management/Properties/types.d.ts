import { unit_card_data_props } from "./data";
import type { UnitDataObject } from "@/app/(nav)/management/properties/data";

export type AddPropertyModalViews = "options" | "add-property-with-id";

export interface AddPropertyOptionsViewProps {
  setModalView: React.Dispatch<React.SetStateAction<AddPropertyModalViews>>;
}

export interface UnitCardProps {
  data: UnitDataObject & { notYetUploaded?: boolean };
  setIsEditing: (a: boolean) => void;
  index: number;
}

export interface CreatePropertyFormProps {
  formType: "rental" | "facility";
  handleSubmit: (data: Record<string, any>) => Promise<void>;
  editMode?: boolean;
}

export interface StaffData {
  id: number;
  user_id: number;
  company_id: number;
  branch_id: number;
  account_officer: string | null;
  personal_title: string;
  real_estate_title: string;
  full_name: string;
  position: string;
  gender: "male" | "female"; // If you have a defined set of genders, you can use a union type
  phone_number: string;
  avatar: string | null;
  picture: string | null;
  user_tag: string;
  created_at: string; // Could be `Date` if you're converting it into a date object
  updated_at: string; // Could be `Date` if you're converting it into a date object
  picture_url: string | null;
}

export interface  PropertyFormStateType {
  state: string;
  city: string;
  lga: string;
  selectedBranch: string;
  staff: { id: string; label: string }[];
  staffOptions: { value: string; label: string }[];
  accountOfficerOptions: { value: string; label: string }[];
  resetKey: number;
}

export interface AllLandlordsResponse {
  data: {
    id: string;
    name: string;
  }[];
}
export interface AllBranchesResponse {
  data: {
    id: string;
    branch_name: string;
  }[];
}
export interface AllInventoryResponse {
  data: {
    id: string;
    title: string;
  }[];
}

export interface AllStaffResponse {
  data: {
    id: string;
    full_name: string;
    position: string;
  }[];
}

export interface PropertyFormPayload {
  title: string;
  state: string;
  local_government: string;
  city_area: string;
  full_address: string;
  category: string;
  description: string;
  video_link?: string | null;
  property_type: string;
  company_id: string;
  agency_fee?: number | null;
  who_to_charge_new_tenant?: string;
  who_to_charge_renew_tenant?: string;
  caution_deposit?: string | null;
  group_chat: (0 | 1) | boolean;
  rent_penalty?: (0 | 1) | boolean | null; // for rental
  fee_penalty?: (0 | 1) | boolean | null; // for facility
  request_call_back: (0 | 1) | boolean;
  book_visitors: (0 | 1) | boolean;
  vehicle_record: (0 | 1) | boolean;
  active_vat: (0 | 1) | boolean;
  currency?: string | null;
  coordinate?: string | null;
  management_fee?: number | null;

  branch_id: string;
  inventory_id?: string | null;
  land_lord_id?: string | null;
  images: File[];

  staff: string[];
}

// export interface AddUnitPayload {
//   unit_name: string;
//   unit_type: string;
//   unit_sub_type: string;
//   unit_preference: string;
//   property_id: string;
//   measurement: string | null;
//   bedroom: string | null;
//   bathroom: string | null;
//   toilet: number | null;
//   facilities: string[];
//   en_suit: 1 | 0;
//   prepaid: 1 | 0;
//   wardrobe: 1 | 0;
//   pet_allowed: 1 | 0;
//   total_area_sqm: string;
//   number_of: number;
//   fee_period: string;
//   fee_amount: number | null;
//   service_charge: number | null;
//   agency_fee?: number | null;
//   management_fee?: number | null;
//   security_fee?: number | null;
//   legal_fee: number | null;
//   caution_fee: number | null;
//   inspection_fee: number | null;
//   other_charge: number | null;
//   negotiation: 1 | 0;
//   total_package: number | null;
//   renew_fee_period?: string;
//   renew_fee_amount?: number | null;
//   renew_service_charge?: number | null;
//   renew_other_charge?: number | null;
//   renew_total_package?: number | null;
//   images: File[];
// }
