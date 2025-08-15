import { empty } from "@/app/config";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { CommentData } from "@/components/tasks/announcements/comment";

export interface ThreadResponse {
  success: boolean;
  data: {
    contributor: any;
    company_summary: any;
    post: any;
    readByData: any[];
    comments: CommentData[];
    similar_posts: any[];
  };
}

export const transformApiData = (apiData: ThreadResponse | null) => {
  if (!apiData || !apiData.data) {
    return {
      post: null,
      companySummary: null,
      contributors: null,
      comments: [],
      targetAudience: "",
      readByData: [],
      similarPosts: [],
    };
  }

  const { data } = apiData;
  // Similar Posts ThreadCardProps;
  const transformedThreadCardProps = data.similar_posts.map((p: any) => ({
    name: p?.contributor?.name || "--- ---",
    picture_url: p?.post?.media[0]?.path || empty,
    role: p?.contributor?.role || "--- ---",
    user_pics: p?.contributor?.picture || empty,
    title: p?.post?.title || "--- ---",
    desc: p?.post?.content || "--- ---",
    time: p?.post?.created_at || "__,__,__",
    comments: p?.post?.comments_count || 0,
    slug: p?.post?.slug || "",
    shareLink: p?.post?.share_link || "",
    id: p?.post?.id || 0,
    published: true,
    video: p?.post?.video_link || "",
    likes: p?.post?.likes_up || 0,
    dislikes: p?.post?.likes_down || 0,
    badge_color: (Number(p?.contributor?.tier) > 1 ? "gray" : undefined) as
      | "gray"
      | undefined,
    isVerified: p?.contributor?.is_verified || false,
  }));

  return {
    post: data.post.post ?? null,
    companySummary: data?.post?.company_summary ?? null,
    contributors: data?.post?.contributor ?? null,
    comments: data?.post.comments ?? [],
    targetAudience: `${data?.post?.post?.state ?? ""}, ${data?.post?.post?.lga ?? ""}`,
    readByData: data?.post?.readByData ?? [],
    similarPosts: transformedThreadCardProps ?? [],
  };
};
