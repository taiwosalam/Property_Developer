import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";

export interface StaffLandlord {
  id: string;
  picture_url: string;
  name: string;
  user_tag: "web" | "mobile";
  email: string;
  phone_number: string;
  badge_color: BadgeIconColors;
  note?: string;
}

export interface StaffLandlordPagination {
  current_page: number;
  total_page: number;
}

export interface IStaffData {
  name: string;
  role: string;
}

export interface StaffLandlordPageData {
  landlords: StaffLandlord[];
  pagination: StaffLandlordPagination;
  staff: IStaffData;
}
