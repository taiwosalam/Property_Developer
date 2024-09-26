import { unit_card_data_props } from "./data";

export interface PropertyProps {
  images: any[];
  id: string | number;
  propertyId: string | number;
  name: string;
  units: number;
  address: string;
  price: number;
  type: "rent" | "gated";
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
  handleSubmit: (a?: any) => void;
  editMode?: boolean;
}
