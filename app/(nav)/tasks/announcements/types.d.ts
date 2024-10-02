export interface Announcement {
  id: string;
  company_id: string;
  branch_id: string;
  title: string;
  property_id: number;
  body: string;
  image_paths: string[];
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  deleted_at: string | null;
  image_urls: string[];
}
