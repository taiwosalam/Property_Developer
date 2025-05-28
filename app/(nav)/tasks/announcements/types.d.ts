import { StaticImageData } from "next/image";

export interface AnnouncementApiResponse {
  announcements: Announcements[];
  total_announcements_this_month: number;
  total_announcements_overall: number;
  total_examined: number;
}

export interface Announcement {
  id: string;
  company_id: string;
  branch_id: string;
  title: string;
  property_id: number;
  description: string;
  views_count: number;
  image_paths: string | StaticImageData[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | "";
  images: string[] | StaticImageData[];
  likes_count: number;
  dislikes_count: number;
}
