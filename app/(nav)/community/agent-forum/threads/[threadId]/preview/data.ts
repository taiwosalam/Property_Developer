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
      targetAudience: '',
      readByData: [],
    };
  }

  const { data } = apiData;
  return {
    post: data.post ?? null,
    companySummary: data.company_summary ?? null,
    contributors: data.contributor ?? null,
    comments: data.comments ?? [],
    targetAudience: `${data.post.state ?? ""}, ${data.post.lga ?? ""}`,
    readByData: data?.readByData ?? [],
  };
};
