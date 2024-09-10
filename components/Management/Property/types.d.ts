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
