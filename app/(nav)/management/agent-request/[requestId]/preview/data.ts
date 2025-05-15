import { empty } from "@/app/config";
import api from "@/services/api";
import {
  CommentData,
  CommentProps,
  PropertyRequestResponse,
  TransformedPropertyRequestData,
} from "./types";
import dayjs from "dayjs";

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

const transformComment = (
  comment: CommentData,
  slug: string
): CommentProps => ({
  id: comment.id,
  name: comment.name,
  image: comment.profile_picture,
  tier_id: comment.tier ? Number(comment.tier) : 0,
  text: comment.text,
  likes: comment.likes ?? 0,
  user_liked: comment.user_liked,
  dislikes: comment.dislikes ?? 0,
  replies: comment.replies?.map((reply) => transformComment(reply, slug)) ?? [],
  slug, // Include slug for all comments
});

// Transformation function
export const transformPropertyRequestResponse = (
  response: PropertyRequestResponse
): TransformedPropertyRequestData => {
  const { AgentRequest, contributor, company_summary, readByData, comments } =
    response.data;
  return {
    agentRequest: {
      id: AgentRequest.id,
      slug: AgentRequest.slug,
      title: AgentRequest.title,
      description: AgentRequest.description,
      propertyCategory: AgentRequest.property_category,
      propertyType: AgentRequest.property_type,
      propertySubType: AgentRequest.property_sub_type,
      state: AgentRequest.state,
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
    },
    contributor,
    companySummary: {
      companyLogo: company_summary.company_logo,
      name: company_summary.name,
      email: company_summary.email,
      companyIsVerified: company_summary.company_is_verified,
      companyStatus: company_summary.company_status,
      joinOurproperty: company_summary.join_ourproperty,
      totalBranch: company_summary.total_branch,
      totalStaff: company_summary.total_staff,
      totalProperty: company_summary.total_property,
      totalUnit: company_summary.total_unit,
      totalReview: company_summary.total_review,
      contactDetails: {
        phoneNumbers: company_summary.contact_details.phone_numbers,
      },
      addresses: {
        headOfficeAddress: company_summary.addresses.head_office_address,
        state: company_summary.addresses.state,
        localGovernment: company_summary.addresses.local_government,
        city: company_summary.addresses.city,
        utilityDocument: company_summary.addresses.utility_document,
      },
      details: {
        joinedDate: company_summary.details.joined_date,
        dateOfRegistration: company_summary.details.date_of_registration,
        cacRegistrationNumber: company_summary.details.cac_registration_number,
        cacCertificate: company_summary.details.cac_certificate,
        industry: company_summary.details.industry,
        membershipNumber: company_summary.details.membership_number,
        membershipCertificate: company_summary.details.membership_certificate,
        companyTypeId: company_summary.details.company_type_id,
        propertyForSale: company_summary.details.property_for_sale,
        propertyForRent: company_summary.details.property_for_rent,
        hospitalityProperty: company_summary.details.hospitality_property,
        completedTransaction: company_summary.details.completed_transaction,
      },
      socialHandles: {
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
      tier_id: AgentRequest.tier_id
    })),
    comments: comments.map((comment) => transformComment(comment, AgentRequest.slug)),
  };
};
