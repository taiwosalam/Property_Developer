import { unit_card_data_props } from "./data";
import type { UnitDataObject } from "@/app/(nav)/management/properties/data";
import { transformPropertyFormData } from "./data";

export type AddPropertyModalViews = "options" | "add-property-with-id";

export interface AddPropertyOptionsViewProps {
  setModalView: React.Dispatch<React.SetStateAction<AddPropertyModalViews>>;
}

export interface UnitCardProps {
  data: UnitDataObject & { notYetUploaded?: boolean };
  setIsEditing: (a: boolean) => void;
  index: number;
  default_image?: string;
}

export interface CreatePropertyFormProps {
  formType: "rental" | "facility";
  handleSubmit: (
    data: ReturnType<typeof transformPropertyFormData>
  ) => Promise<void>;
  editMode?: boolean;
  propertyId?: string;
  onAddUnit?: () => void;
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

export interface PropertyFormStateType {
  state: string;
  city: string;
  lga: string;
  selectedBranch: { value: string; label: string };
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
