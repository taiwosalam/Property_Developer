//import { CommentData } from "@/components/tasks/announcements/comment";
import { AnnouncementDetailsResponse } from "../../types";
import { empty } from "@/app/config";
//import { transformComment } from "@/app/(nav)/community/agent-request/[requestId]/preview/data";

export interface IAnnounceUserSummary {
  user_id: number;
  user_name: string;
  tier_id: number;
  image: string | null;
  date: string;
  time: string;
}

export interface CommentProps {
  id: string | number;
  name: string;
  image?: string | null;
  tier_id?: number;
  text: string;
  likes: number;
  dislikes: number;
  user_liked: boolean;
  user_disliked: boolean;
  replies?: CommentProps[];
  slug: string;
}
export interface AnnouncementDetailsPageData {
  id: number;
  title: string;
  description: string;
  media: {
    src: string[];
    isVideo: boolean;
    videoUrl: string;
  };
  likes: number;
  dislikes: number;
  comments: CommentProps[];
  summary: {
    property_name: string;
    branch_name: string;
  };
  viewers: IAnnounceUserSummary[];
  read_by: IAnnounceUserSummary[];
  delivered: IAnnounceUserSummary[];
}

export interface CommentData {
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
  replies?: CommentData[];
}

export const transformComment = (
  comment: CommentData,
  slug: string
): CommentProps => ({
  id: comment.id,
  name: comment.name || "No name",
  image: comment.profile_picture,
  tier_id: comment.tier ? Number(comment.tier) : 0,
  text: comment.content,
  likes: comment.likes ?? 0,
  user_liked: comment.user_liked,
  user_disliked: comment.user_disliked,
  dislikes: comment.dislikes ?? 0,
  replies: comment.replies?.map((reply) => transformComment(reply, slug)) ?? [],
  slug, // Include slug for all comments
});

export const transformAnnouncementDetailsData = (
  data: AnnouncementDetailsResponse
): AnnouncementDetailsPageData => {
  const { announcement } = data;
  return {
    id: announcement?.id,
    title: announcement?.title,
    description: announcement?.description,
    likes: announcement?.likes_count,
    dislikes: announcement?.dislikes_count,
    comments: announcement?.comments.map((comment) =>
      transformComment(comment, "slug")
    ),
    media: {
      src:
        announcement?.images.length > 0
          ? announcement?.images.map((image) => image.url)
          : [],
      isVideo: announcement?.video_link ? true : false,
      videoUrl: announcement?.video_link ? announcement.video_link : "",
    },
    summary: {
      property_name: announcement?.summary?.property_name ?? "Bodija Branch",
      branch_name: announcement?.summary?.branch_name ?? "Bodija",
    },
    viewers: [],
    read_by: [],
    delivered: [],
  };
};
