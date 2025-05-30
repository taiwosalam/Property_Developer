import { CommentData } from "@/components/tasks/announcements/comment";
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
  images: {
    id: number;
    url: string;
    is_default: number;
  }[];
  likes_count: number;
  dislikes_count: number;
}

type AnnouncementComment = {
  id: string | number;
  profile_picture: string;
  name: string;
  tier: string;
  content: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  user_liked: boolean;
  user_disliked: boolean;
  replies?: AnnouncementComment[];
};

type AnnouncementDetailsResponse = {
  message: string;
  announcement: {
    id: number;
    title: string;
    description: string;
    video_link: string | null;
    branch_id: number | null;
    property_id: number | null;
    company_id: number;
    created_by: number;
    created_at: string;
    updated_at: string;
    likes_count: number;
    dislikes_count: number;
    views_count: number;
    viewers: [];
    read_by: [];
    delivered: [];
    summary: {
      branch_name: string | null;
      property_name: string | null;
    };
    comments: AnnouncementComment[];
    images: AnnouncementImage[];
  };
};

type AnnouncementImage = {
  id: number;
  url: string;
  is_default: number;
};

type Comment = {
  id: number;
  content: string;
  user_id: number;
  commentable_type: string;
  commentable_id: number;
  created_at: string;
  updated_at: string;
};
