// Types
import { StaticImageData } from "next/image";

export interface StaffProfilePortfolioProps {
  title: string;
  items: StaffProfilePortfolioItemProps[];
}

export interface StaffProfilePortfolioItemProps {
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
  };
}

export interface StaffProfileProps {
  personal_title: string;
  real_estate_title: string;
  full_name: string;
  email: string;
  phone_number: string;
  gender: string;
  position: string;
  avatar?: string;
  picture?: string;
  about: string;
}
