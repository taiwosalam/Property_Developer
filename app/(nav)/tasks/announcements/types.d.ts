import { StaticImageData } from "next/image";

export interface Announcement {
  id: string;
  company_id: string;
  branch_id: string;
  title: string;
  property_id: number;
  description: string;
  image_paths: string | StaticImageData[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | '';
  image: string | StaticImageData[];
}
