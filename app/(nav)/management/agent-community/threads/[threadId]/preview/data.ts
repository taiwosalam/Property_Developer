import { CommentData } from "@/components/tasks/announcements/comment";

export interface ThreadResponse {
  success: boolean;
  data: {
    contributor: any;
    company_summary: any;
    post: any;
    readByData: any[];
    comments: CommentData[];
  };
}

export const transformApiData = (apiData: ThreadResponse | null) => {
  if (!apiData || !apiData.data) {
    return {
      post: null,
      companySummary: null,
      contributors: null,
      comments: [],
      targetAudience: [],
      readByData: [],
    };
  }

  const { data } = apiData;

  let targetAudience: string[] = [];
  try {
    const audience = data.post?.target_audience;
    if (typeof audience === "string") {
      targetAudience = JSON.parse(audience);
    } else if (Array.isArray(audience)) {
      targetAudience = audience;
    }
  } catch (error) {
    console.error("Error parsing target_audience:", error);
    targetAudience = [];
  }

  return {
    post: data.post ?? null,
    companySummary: data.company_summary ?? null,
    contributors: data.contributor ?? null,
    comments: data.comments ?? [],
    targetAudience,
    readByData: data?.post?.readByData ?? [],
  };
};
