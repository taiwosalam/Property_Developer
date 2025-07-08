import { empty } from "@/app/config";
import api from "@/services/api";
import {
  CommentData,
  CommentProps,
  PropertyRequestResponse,
  TransformedPropertyRequestData,
} from "./types";
import dayjs from "dayjs";
import { formatNumber } from "@/utils/number-formatter";
import { capitalizeWords } from "@/hooks/capitalize-words";

export const calculateYearsInIndustry = (dateString: string) => {
  if (!dateString) return null;
  const registrationDate = new Date(dateString);
  const today = new Date();
  const years = today.getFullYear() - registrationDate.getFullYear();
  return `${years}+ years`;
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
    min_budget: data.min_budget?.toString() || "",
    max_budget: data.max_budget?.toString() || "",
    valid_till: data.valid_till || "",
    _method: "patch",
  };

  console.log("formattedData", formattedData);
  try {
    const response = await api.post(
      `/agent-community/property-requests/${id}`,
      formattedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating property request:", error);
    throw error;
  }
};

export const deletePropertyRequest = async (id: string) => {
  try {
    await api.delete(`/agent-community/property-requests/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting property request:", error);
    return false;
  }
};

export const transformComment = (
  comment: CommentData,
  slug: string
): CommentProps => ({
  id: comment.id,
  name: comment.name || "No name",
  image: comment.profile_picture,
  tier_id: comment.tier ? Number(comment.tier) : 0,
  text: comment.text,
  likes: comment.likes ?? 0,
  user_liked: comment.user_liked,
  user_disliked: comment.user_disliked,
  dislikes: comment.dislikes ?? 0,
  replies: comment.replies?.map((reply) => transformComment(reply, slug)) ?? [],
  slug, // Include slug for all comments
});

// Transformation function
export const transformPropertyRequestResponse = (
  response: PropertyRequestResponse
): TransformedPropertyRequestData => {
  console.log("response", response);
  const { post, similar_posts } = response;
  const { AgentRequest, contributor, company_summary, readByData, comments } =
    post;
  return {
    agentRequest: {
      id: AgentRequest.id,
      slug: AgentRequest.slug,
      title: AgentRequest.title,
      user_disliked: AgentRequest.user_disliked,
      user_liked: AgentRequest.user_liked,
      description: AgentRequest.description,
      propertyCategory: AgentRequest.property_category,
      propertyType: AgentRequest.property_type,
      propertySubType: AgentRequest.property_sub_type,
      state: AgentRequest.state,
      created_at: AgentRequest.created_at,
      updated_at: AgentRequest.updated_at,
      lga: AgentRequest.lga,
      agent: AgentRequest.agent,
      minBudget: AgentRequest.min_budget,
      maxBudget: AgentRequest.max_budget,
      targetAudience: AgentRequest.target_audience,
      startDate: dayjs(AgentRequest.start_date).format("MMM DD YYYY"),
      endDate: AgentRequest.end_date,
      createdAt: AgentRequest.created_at,
      likesUp: AgentRequest.likes_up,
      likesDown: AgentRequest.likes_down,
      commentsCount: AgentRequest.comments_count,
      viewsCount: AgentRequest.views_count,
      shareLink: AgentRequest.share_link,
      companyBio: company_summary.company_bio,
    },
    contributor,
    companySummary: {
      company_logo: company_summary.company_logo,
      dark_logo: company_summary.dark_logo,
      company_bio: company_summary.company_bio,
      name: company_summary.name,
      email: company_summary.email,
      company_is_verified: company_summary.company_is_verified,
      company_status: company_summary.company_status,
      join_ourproperty: company_summary.join_ourproperty,
      total_branches: company_summary.details.total_branches,
      total_staff: company_summary.details.total_staff,
      total_property: company_summary.total_property,
      total_unit: company_summary.details.total_unit,
      total_reviews: company_summary.details.total_reviews,
      contact_details: {
        phone_numbers: company_summary.contact_details.phone_numbers,
      },
      addresses: {
        head_office_address: company_summary.addresses.head_office_address,
        state: company_summary.addresses.state,
        local_government: company_summary.addresses.local_government,
        city: company_summary.addresses.city,
        utility_document: company_summary.addresses.utility_document,
      },
      details: {
        joined_date: company_summary.details.joined_date,
        date_of_registration: company_summary.details.date_of_registration,
        cacRegistrationNumber: company_summary.details.cac_registration_number,
        cacCertificate: company_summary.details.cac_certificate,
        industry: company_summary.details.industry,
        membershipNumber: company_summary.details.membership_number,
        membershipCertificate: company_summary.details.membership_certificate,
        company_type_id: company_summary.details.company_type_id,
        property_for_sale: company_summary.details.property_for_sale,
        property_for_rent: company_summary.details.property_for_rent,
        hospitality_property: company_summary.details.hospitality_property,
        completed_transaction: company_summary.details.completed_transaction,
        total_reviews: company_summary.details.total_reviews,
        total_branches: company_summary.details.total_branches,
        total_staff: company_summary.details.total_staff,
        total_unit_managing: company_summary.details.total_unit_managing,
        //completed_transaction: company_summary.details.completed_transaction,
      },
      social_handles: {
        facebook: company_summary.social_handles.facebook,
        x: company_summary.social_handles.x,
        youtube: company_summary.social_handles.youtube,
        instagram: company_summary.social_handles.instagram,
        linkedin: company_summary.social_handles.linkedin,
        tiktok: company_summary.social_handles.tiktok,
        website: company_summary.social_handles.website,
      },
      services: company_summary.services || [],
    },
    readByData: readByData.map((reader) => ({
      ...reader,
      tier_id: AgentRequest.tier_id,
    })),
    comments: comments.map((comment) =>
      transformComment(comment, AgentRequest.slug)
    ),
    // similar posts
    similarPosts: similar_posts.map((p) => ({
      id: p.AgentRequest.id || 0,
      cardType: "agent-community",
      userName: `${capitalizeWords(p?.contributor?.title || "")} ${capitalizeWords(p?.contributor?.name || "")}`,
      requestDate: p?.AgentRequest?.created_at || "--- ---",
      pictureSrc: p?.contributor?.picture || empty,
      requestId: p.AgentRequest.id,
      state: p.AgentRequest.state,
      lga: p.AgentRequest.lga,
      propertyType: p.AgentRequest.property_type,
      expiredDate:
        dayjs(p.AgentRequest.end_date).format("MMM DD YYYY") || "__,__,__",
      minBudget: `₦${formatNumber(p?.AgentRequest?.min_budget)}` || "--- ---",
      maxBudget: `₦${formatNumber(p?.AgentRequest?.max_budget)}` || "--- ---",
      subType: p.AgentRequest.property_sub_type,
      requestType: p.AgentRequest.request_type,
      description: p.AgentRequest.description,
      category: p.AgentRequest.property_category,
      targetAudience: p.AgentRequest.target_audience,
      propertyTitle: p.AgentRequest.title,
      userTitle: p?.contributor?.professional_title,
      slug: p.AgentRequest.slug,
      cardViewDetails: [
        { label: "Location(state)", accessor: "state" },
        { label: "Local Government", accessor: "lga" },
        { label: "Property Type", accessor: "propertyType" },
        { label: "Expired Date", accessor: "expiredDate" },
        { label: "Min Budget", accessor: "minBudget" },
        { label: "Max Budget", accessor: "maxBudget" },
      ],
    })),
  };
};
