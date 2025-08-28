//import { CommentData } from "@/components/tasks/announcements/comment";
import api, { handleAxiosError } from "@/services/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import {
  AnnouncementDetailsResponse,
  AnnouncementResponseDetails,
} from "../../../../../../components/PAGES/DIRECTOR/PropertyManager/variantA/tasks/announcements/types";
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
  my_like?: boolean;
  replies?: CommentProps[];
  slug: string;
}
export interface AnnouncementDetailsPageData {
  id: number;
  title: string;
  description: string;
  media: {
    src: string;
    isVideo: boolean;
  }[];
  likes: number;
  dislikes: number;
  my_dislike: boolean;
  my_like: boolean;
  comments: CommentProps[];
  summary: {
    property_name: string;
    branch_name: string;
  };
  viewers: Array<string | null>;
  read_by: IAnnounceUserSummary[];
  delivered: IAnnounceUserSummary[];
}

export interface CommentData {
  id: string | number;
  profile_picture: string;
  name: string;
  tier: string;
  content: string;
  user?: {
    id: number;
    name: string;
    profile_picture: string;
    tier: string;
  };
  createdAt: string;
  likes?: number;
  dislikes?: number;
  my_like?: boolean;
  likes_count?: number;
  dislikes_count?: number;
  my_dislike?: boolean;
  user_liked: boolean;
  user_disliked: boolean;
  replies?: CommentData[];
}

export const transformComment = (
  comment: CommentData,
  slug: string
): CommentProps => ({
  id: comment.id,
  name:
    comment.name?.toLowerCase() ||
    comment?.user?.name?.toLowerCase() ||
    "No name",
  image: comment.profile_picture || comment?.user?.profile_picture,
  tier_id: comment.tier
    ? Number(comment.tier)
    : comment?.user?.tier
      ? Number(comment?.user?.tier)
      : 0,
  text: comment.content,
  likes: comment.likes || comment?.likes_count || 0,
  user_liked: comment.user_liked ?? comment?.my_like ?? false,
  user_disliked: comment.user_disliked ?? comment?.my_dislike ?? false,
  dislikes: comment.dislikes || comment?.dislikes_count || 0,
  replies: comment.replies?.map((reply) => transformComment(reply, slug)) ?? [],
  slug, // Include slug for all comments
});

export const transformAnnouncementDetailsData = (
  data: AnnouncementResponseDetails
): AnnouncementDetailsPageData => {
  const { announcement } = data;
  return {
    id: announcement?.id,
    title: announcement?.title,
    description: announcement?.description,
    likes: announcement?.likes_count,
    dislikes: announcement?.dislikes_count,
    my_dislike: announcement?.my_dislike,
    my_like: announcement?.my_like,
    comments: announcement?.comments
      .reverse()
      .map((comment) => transformComment(comment, "slug")),
    media: [
      ...(announcement.video_link
        ? [{ src: announcement.video_link, isVideo: true }]
        : []),
      ...announcement.images.map((image) => ({
        src: image.url,
        isVideo: false,
      })),
    ],

    summary: {
      property_name: announcement?.summary?.property_name || "All",
      branch_name: announcement?.summary?.branch_name || "All",
    },
    viewers: announcement?.comments?.map((user) => user?.user?.profile_picture),
    read_by: announcement?.readByData?.map((read, index) => ({
      user_id: index + 1,
      user_name: read?.name?.toLowerCase(),
      tier_id: 1,
      image: read?.profile_picture,
      date: read?.viewed_at,
      time: read?.viewed_at,
    })),
    delivered: [],
  };
};

export const sendAnnounceComment = async (id: string, content: string) => {
  const payload = {
    content,
  };
  try {
    const response = await api.post(`/announcements/${id}/comment`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("announcementDispatch"));
      return true;
    }
    // return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
    } else {
      toast.error("Error sending comment:");
    }
    handleAxiosError(error);
    return false;
    // throw error;
  }
};

export const toggleAnnouncementLike = async (id: string, modeType: string) => {
  const payload = {
    type: modeType,
  };
  try {
    const response = await api.post(`/announcements/${id}/reaction`, payload);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("announcementDispatch"));
      return true;
    }
    // return response.data;
  } catch (error) {
    handleAxiosError(error);
    return false;
    // throw error;
  }
};

export const sendAnnouncementReply = async (id: string, content: string) => {
  const payload = {
    content,
  };
  try {
    const response = await api.post(
      `/announcement/comments/${id}/reply`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("announcementDispatch"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const toggleAnnouncementReaction = async (id: string, type: string) => {
  const payload = {
    type,
  };
  try {
    const response = await api.post(
      `announcement/comments/${id}/reaction`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("announcementDispatch"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
