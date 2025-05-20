import { empty } from "@/app/config";
import { title } from "process";
import { CommentProps, ThreadCardProps } from "./type";
import api from "@/services/api";
// import { transformFormData } from "./my-properties-request/data";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

export const calculateYearsInIndustry = (dateString: string) => {
  if (!dateString) return null;
  const registrationDate = new Date(dateString);
  const today = new Date();
  const years = today.getFullYear() - registrationDate.getFullYear();
  return `${years}+ years`;
};

// Helper function to format phone numbers
export const formatPhoneNumbers = (
  phoneNumbers: string | string[] | null | undefined
): string => {
  try {
    if (!phoneNumbers) return "--- ---";

    // Handle JSON string format
    if (typeof phoneNumbers === "string") {
      const parsed = JSON.parse(phoneNumbers);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean).join(", ");
      }
      return phoneNumbers || "--- ---";
    }

    // Handle array format
    if (Array.isArray(phoneNumbers)) {
      return phoneNumbers.filter(Boolean).join(", ");
    }

    return "--- ---";
  } catch (error) {
    console.error("Error parsing phone numbers:", error);
    return "--- ---";
  }
};

export const getThreads = async () => {
  try {
    const response = await api.get("/agent_community");
    return response.data;
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const getThreadById = async (id: string) => {
  try {
    const response = await api.get(`/agent_community/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching thread:", error);
    throw error;
  }
};

export const getLoggedInUserThreads = async () => {
  try {
    const response = await api.get("/agent_community/user/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const getAllPropertyRequests = async () => {
  try {
    const response = await api.get("/agent-community/property-requests/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching property requests:", error);
    throw error;
  }
};

export const getLoggedInUserPropertyRequests = async () => {
  try {
    const response = await api.get("/agent-community/property-requests/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching property requests:", error);
    throw error;
  }
};

export const updatePropertyRequest = async (id: string, data: any) => {
  const keyMapping: Record<string, string> = {
    title: "title",
    content: "description",
    property_category: "property_category",
    property_type: "property_type",
    property_sub_type: "property_sub_type",
    target_audience: "target_audience",
    min_budget: "min_budget",
    max_budget: "max_budget",
    valid_till: "valid_till",
  };

  const formattedData = {
    title: data.title || "",
    description: data.content || "",
    property_category: data.property_category || "",
    property_type: data.property_type || "",
    property_sub_type: data.property_sub_type || "",
    target_audience: data.target_audience
      ? typeof data.target_audience === "string"
        ? [data.target_audience]
        : Array.isArray(data.target_audience)
        ? data.target_audience
        : [data.target_audience]
      : [],
    min_budget: Number(data.min_budget) || "",
    max_budget: Number(data.max_budget) || "",
    valid_till: data.valid_till || "",
    _method: "patch",
  };

  try {
    const response = await api.post(`/agent_requests/${id}`, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error updating property request:", error);
    throw error;
  }
};

// Helper function to transform API data into ThreadCardProps
export const transformToThreadCardProps = (data: any[]): ThreadCardProps[] => {
  return data.map((thread, index) => ({
    id: index,
    name: thread.user
      ? `${thread.user.title ?? ""} ${thread.user.name}`
      : "--- ---",
    picture_url:
      thread.post && thread.post.media && thread.post.media.length > 0
        ? thread.post.media[0].path
        : empty,
    role: thread.user ? thread.user.professional_title : "--- ---",
    time: thread.post ? thread.post.created_at : "--- ---",
    title: thread.post ? thread.post.title : "--- ---",
    desc: thread.post ? thread.post.content : "--- ---",
    comments: thread.post ? thread.post.comments_count : "--- ---",
    user_pics: thread.user ? thread.user.picture : empty,
    likes: thread.post ? thread.post.likes_up : "--- ---",
    dislikes: thread.post ? thread.post.likes_down : "--- ---",
    slug: thread.post ? thread.post.slug : "--- ---",
    shareLink: thread.post ? thread.post.share_link : "--- ---",
    video: thread.post ? thread.post.video_link : "--- ---",
    published: thread.post.published, 
    user_liked: thread.post.user_liked, 
    user_disliked: thread.post.user_disliked, 
    badge_color: thread.user.tier > 1 ? "gray" : undefined,
    // badge_color: thread.user.tier ? tierColorMap[thread.user.tier as keyof typeof tierColorMap] : undefined,
  }));
};

export const deletePropertyRequest = async (id: string) => {
  try {
    await api.delete(`/agent_requests/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting property request:", error);
    return false;
  }
};

export const companyStats = [
  { label: "Joined ourproperty.ng", value: "2 Months Ago" },
  { label: "Years in Industry", value: "6 Years+" },
  { label: "Total Branch", value: "23" },
  { label: "Total Staff", value: "234" },
  { label: "Property for sale", value: "23234" },
  { label: "Property for Rent", value: "63234" },
  { label: "Hospitality Property", value: "74234" },
  { label: "Total Unit Managing", value: "734" },
  { label: "Total Reviews", value: "54" },
  { label: "Completed Transaction", value: "74" },
];

export const propertySummaryData = [
  { label: "Posted Date", value: "12/10/2024" },
  { label: "Last Updated", value: "12/10/2024" },
  { label: "Total Seen", value: "2341" },
  { label: "Total Comment", value: "23414" },
];

export const propertyMoreDetails = [
  { label: "Location:", value: "Oyo State" },
  { label: "Category:", value: "Short Let" },
  { label: "Property Type:", value: "Apaertment" },
  { label: "Sub Type:", value: "Bungalow" },
  { label: "Min Budget:", value: "₦75,000,000" },
  { label: "Max Budget:", value: "₦200,000,000" },
  { label: "Date Range:", value: "12/10/2024 - 12/10/2024" },
];

export const readyByData = [
  {
    name: "Salam AIshat",
    picture: "/empty/user1.svg",
    verified: true,
    time: "12/10/2024 (02:30pm)",
  },
  {
    name: "Salam AIshat",
    picture: "/empty/user1.svg",
    verified: true,
    time: "12/10/2024 (02:30pm)",
  },
  {
    name: "Salam AIshat",
    picture: "/empty/user1.svg",
    verified: true,
    time: "12/10/2024 (02:30pm)",
  },
  {
    name: "Salam AIshat",
    picture: "/empty/user2.svg",
    verified: false,
    time: "12/10/2024 (02:30pm)",
  },
  {
    name: "Salam AIshat",
    picture: "/empty/user3.svg",
    verified: true,
    time: "12/10/2024 (02:30pm)",
  },
];

export const textareaValue =
  "#Commercial and retail real estate fundamentals are expected to remain strong due to the scarcity of new construction deliveries, prompting compelling opportunities for investors amid high interest rates and inflation in the market, writes CHINEDUM UWAEGBULAM. Despite economic headwinds and challenges with obtaining building permits, experts predict that the demand for housing will remain strong, and the market will see a steady increase in property values this year. There are also opportunities available for high-quality properties that meet the needs of investors and tenants, while low mortgage rates and government incentives will likely contribute to this optimistic outlook as inflation may remain a concern in 2024, affecting both home prices and mortgage rates.";

export const MyArticleSummaryData = [
  { label: "Posted Date", value: "12/10/2024" },
  { label: "Last Updated", value: "12/10/2024" },
  { label: "Total Seen", value: "574546" },
  { label: "Total Comments", value: "324546" },
  { label: "Target Audience", value: "All State, All Local Government Area" },
];
