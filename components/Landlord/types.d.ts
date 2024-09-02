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
