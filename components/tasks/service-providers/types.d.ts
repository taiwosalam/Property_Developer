export interface ServiceProviderProps {
  id: string | number;
  first_name: string;
  last_name: string;
  email: string;
  user_tag: "web" | "mobile";
  phone_number: string;
  picture?: string;
  avatar?: string;
  picture_url: string;
  service: string;
}

export type AddServiceProviderModalOptions =
  | "options"
  | "add-service-provider"
  | "invite-service-provider"
  | "add-with-id";

export interface AddServiceProviderOptionsProps {
  showForm: React.Dispatch<
    React.SetStateAction<AddServiceProviderModalOptions>
  >;
}
