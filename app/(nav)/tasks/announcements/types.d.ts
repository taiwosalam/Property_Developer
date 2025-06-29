import { CommentData } from "@/components/tasks/announcements/comment";
import { StaticImageData } from "next/image";

// export interface Announcement {
//   id: string;
//   company_id: string;
//   branch_id: string;
//   title: string;
//   property_id: number;
//   description: string;
//   views_count: number;
//   image_paths: string | StaticImageData[];
//   created_at: string; // ISO date string
//   updated_at: string; // ISO date string
//   deleted_at: string | "";
//   images: {
//     id: number;
//     url: string;
//     is_default: number;
//   }[];
//   likes_count: number;
//   dislikes_count: number;
// }

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


/** ------------------------------------------- */






/** GET ALL ANNOUNCEMENTS */
interface AnnouncementApiResponse {
  status: "success";
  total_examine: number;
  total_examine_month: number;
  data: Announcements[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
};

type Announcements = {
  id: number;
  title: string;
  description: string;
  video_link: string | null;
  branch_id: number;
  property_id: number;
  company_id: number;
  created_by: number;
  created_at: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
  images: Array<{
    id: number;
    url: string;
    is_default: number;
  }>; 
  poster: {
    name: string;
    profilePicture: string;
    tier: string;
  };
  manager: {
    name: string;
  };
  comments: any[]; 
};



/** GET ANNOUNCEMENT BY ID */
export type AnnouncementResponseDetails = {
  message: string;
  total_announcements_this_month: number;
  total_announcements_overall: number;
  announcement: Announcement;
};

type Announcement = {
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
  comments: any[]; // Replace with specific type if known
  comments_count: number;
  images: AnnouncementImage[];
  summary: {
    property_name: string | null;
    branch_name: string | null;
  };
  viewers: Viewer[];
  read_by: any[]; // Replace with specific type if needed
  delivered: any[]; // Replace with specific type if needed
  poster: {
    name: string;
    profilePicture: string | null;
    tier: string;
  };
  manager: {
    name: string;
  };
};

type AnnouncementImage = {
  id: number;
  url: string;
  is_default: number;
};

type Viewer = {
  id: number;
  name: string;
  profilePicture: string | null;
};

