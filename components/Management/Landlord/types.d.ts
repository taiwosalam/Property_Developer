export interface AddLandlordCardProps {
  desc: string;
  title: string;
  buttonText: string;
  onClick?: () => void;
}

export type AddLandlordModalOptions =
  | "options"
  | "choose-avatar"
  | "add-landlord"
  | "add-multiple-owners"
  | "invite-owner"
  | "invite-multiple-owners"
  | "add-landlord-with-id";

export interface AddLandlordOptionsProps {
  showForm: React.Dispatch<React.SetStateAction<AddLandlordModalOptions>>;
}

export interface LandlordProps {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  user_tag: "web" | "mobile";
  phone_number: string;
  picture?: string;
  avatar?: string;
  picture_url: string;
}

export type FilterOption = {
  label: string;
  value: string;
};

export type FilterOptionWithRadio = {
  label: string;
  value: FilterOption[];
};

export type FilterOptionWithDropdown = {
  label: string;
  value: FilterOption[];
};

export type FilterModalProps = {
  closeModal?: () => void;
  filterOptionsWithDropdown?: FilterOptionWithDropdown[];
  filterOptions?: FilterOption[];
  filterOptionsWithRadio?: FilterOptionWithRadio[];
  onApply: (selectedFilters: string[]) => void;
  title?: string;
  onStateSelect?: (state: string) => void;
  date?: boolean; // New prop to determine if date picker should be shown
  article?: boolean;
  propertyRequest?: boolean;
};
