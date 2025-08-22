// Types
import { StaticImageData } from "next/image";

export interface StaffProfilePortfolioProps {
  title: string;
  items: StaffProfilePortfolioItemProps[];
  branchId?: string;
}

export interface StaffProfilePortfolioItemProps {
  link?: string;
  image: string | StaticImageData;
  property?: {
    name: string;
    location: string;
  };
  user?: {
    name: string;
    email: string;
    verified?: boolean;
    phone_number: string;
    badge_color?: "green" | "black" | "blue" | "red" | "yellow" | "gray";
  };
}

export interface StaffProfileProps {
  branch_id: string;
  id: string;
  personal_title: string;
  real_estate_title: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  position: string;
  avatar?: string;
  picture?: string;
  about:any;
  status: string;
  experience: number | string;
  isVerified?: boolean;
}
