import { empty } from "@/app/config";
import api from "@/services/api";

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





export interface PropertyRequest {
  id: number;
  slug: string;
  title: string;
  description: string;
  propertyCategory: string;
  propertyType: string;
  propertySubType: string | null;
  state: string;
  lga: string;
  agent: string;
  minBudget: string;
  maxBudget: string;
  targetAudience: string[] | null;
  startDate: string;
  endDate: string;
  createdAt: string;
  likesUp: number;
  likesDown: number;
  commentsCount: number;
  viewsCount: number;
  shareLink: string;
}

export interface Contributor {
  id: number;
  name: string;
  phone: string;
  bio: string | null;
  title: string;
  professionalTitle: string;
  role: string;
  tier: string;
  picture: string;
  email: string;
}

export interface CompanySummary {
  companyLogo: string | null;
  name: string | null;
  email: string | null;
  companyIsVerified: boolean | null;
  companyStatus: string | null;
  joinOurproperty: string;
  totalBranch: number;
  totalStaff: number;
  totalProperty: number;
  totalUnit: number;
  totalReview: number;
  contactDetails: {
    phoneNumbers: string[];
  };
  addresses: {
    headOfficeAddress: string | null;
    state: string | null;
    localGovernment: string | null;
    city: string | null;
    utilityDocument: string | null;
  };
  details: {
    joinedDate: string | null;
    dateOfRegistration: string | null;
    cacRegistrationNumber: string | null;
    cacCertificate: string | null;
    industry: string | null;
    membershipNumber: string | null;
    membershipCertificate: string | null;
    companyTypeId: string | null;
    propertyForSale: number;
    propertyForRent: number;
    hospitalityProperty: number;
    completedTransaction: number;
  };
  socialHandles: {
    facebook: string | null;
    x: string | null;
    youtube: string | null;
    instagram: string | null;
    linkedin: string | null;
    tiktok: string | null;
    website: string | null;
  };
  services: string[];
}

export interface CommentData {
  id: string | number;
  profilePicture: string;
  name: string;
  comment: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  replies?: CommentData[];
}

export interface PropertyRequestResponse {
  message: string;
  data: {
    AgentRequest: any;
    contributor: any;
    company_summary: any;
    readByData: {
      name: string;
      profile_picture: string;
      email_verified: boolean;
      viewed_at: string;
    }[];
    comments: CommentData[];
  };
}

export interface TransformedPropertyRequestData {
  propertyRequest: PropertyRequest;
  contributor: Contributor;
  companySummary: CompanySummary;
  readByData: {
    name: string;
    profile_picture: string;
    email_verified: boolean;
    viewed_at: string;
  }[];
  comments: CommentData[];
}

// Transformation function
export const transformPropertyRequestResponse = (
  response: PropertyRequestResponse
): TransformedPropertyRequestData => {
  const { AgentRequest, contributor, company_summary, readByData, comments } =
    response.data;
  return {
    propertyRequest: {
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
      startDate: AgentRequest.start_date,
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
    readByData: readByData || [],
    comments: comments || [],
  };
};
