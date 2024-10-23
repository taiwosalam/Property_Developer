import { unit_card_data_props } from "./data";

export interface PropertyProps {
  images: string[];
  id: string | number;
  propertyId: string | number;
  name: string;
  units: number;
  address: string;
  price: number;
  type?: "rental" | "gated";
  annualReturns?: number;
  annualIncome?: number;
  currency: string;
}

export type AddPropertyModalViews = "options" | "add-property-with-id";

export interface AddPropertyOptionsViewProps {
  setModalView: React.Dispatch<React.SetStateAction<AddPropertyModalViews>>;
}

export interface PropertyPreviewProps {
  images?: any[];
}

export type UnitCardDataProps = keyof typeof unit_card_data_props;

export interface UnitCardProps {
  data: Partial<Record<UnitCardDataProps, string>>;
  handleRemove?: () => void;
  setIsEditing: (a: boolean) => void;
}

export interface CreatePropertyFormProps {
  formType: "rental" | "gated-estate";
  handleSubmit: (a?: any) => void;
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
