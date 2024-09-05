export interface TenantProps {
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
