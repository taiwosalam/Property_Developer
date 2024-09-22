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
