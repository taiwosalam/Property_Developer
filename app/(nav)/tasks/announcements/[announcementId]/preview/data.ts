import { CommentData } from "@/components/tasks/announcements/comment";
import { AnnouncementDetailsResponse } from "../../types";

export interface IAnnounceUserSummary {
  user_id: number;
  user_name: string;
  tier_id: number;
  image: string | null;
  date: string;
  time: string;
}

export interface AnnouncementDetailsPageData {
  id: number;
  title: string;
  description: string;
  images: string[];
  videoUrl: string | null;
  likes: number;
  dislikes: number;
  comment: CommentData[];
  summary: {
    property_name: string;
    branch_name: string;
  };
  viewers: IAnnounceUserSummary[];
  read_by: IAnnounceUserSummary[];
  delivered: IAnnounceUserSummary[];
}

export const transformAnnouncementDetailsData = (
  data: AnnouncementDetailsResponse
): AnnouncementDetailsPageData => {
  const { announcement } = data;
  return {
    id: announcement?.id,
    title: announcement?.title,
    description: announcement?.description,
    images: announcement.images.map((image) => image.url),
    videoUrl: announcement?.video_link,
    likes: announcement?.likes_count,
    dislikes: announcement?.dislikes_count,
    comment: [],
    summary: {
      property_name: "Bodija Property",
      branch_name: "Bodija",
    },
    viewers: [],
    read_by: [],
    delivered: [],
  };
};
