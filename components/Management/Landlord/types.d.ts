export interface AddLandlordCardProps {
  desc: string;
  title: string;
  buttonText: string;
  onClick?: () => void;
}

export type AddLandlordModalOptions =
  | "options"
  | "add-landlord"
  | "add-multiple-owners"
  | "invite-owner"
  | "invite-multiple-owners"
  | "add-landlord-with-id";

export interface AddLandlordOptionsProps {
  showForm: React.Dispatch<React.SetStateAction<AddLandlordModalOptions>>;
}

export interface LandlordCardProps {
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
