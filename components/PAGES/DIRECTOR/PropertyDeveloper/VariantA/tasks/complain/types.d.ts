import { CommentData } from "@/components/tasks/announcements/comment";
import { StaticImageData } from "next/image";

type ComplainComment = {
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
  replies?: ComplainComment[];
};

type ComplainDetailsResponse = {
  message: string;
  complain: {
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
    comments: ComplainComment[];
    images: ComplainImage[];
  };
};

type ComplainImage = {
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

/** GET ALL COMPLAINS */
interface ComplainApiResponse {
  status: "success";
  total_complain: number;
  total_complain_month: number;
  data: Complains[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

type Complains = {
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
  views_count_today: number,
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

/** GET Complain BY ID */
export type ComplainResponseDetails = {
  message: string;
  total_complain: number;
  total_complains_month: number;
  complain: Complain;
};

type Complain = {
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
  my_like: boolean;
  my_dislike: boolean;
  images: ComplainImage[];
  summary: {
    property_name: string | null;
    branch_name: string | null;
  };
  readByData: Viewer[]; // Replace with specific type if needed
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

type ComplainImage = {
  id: number;
  url: string;
  is_default: number;
};

type Viewer = {
  name: string;
  profile_picture: string;
  title: string;
  email_verified: true;
  viewed_at: string;
};
