import { companyData } from "@/app/(nav)/settings/company/data";

export interface PropertyRequest {
  id: number;
  slug: string;
  title: string;
  description: string;
  propertyCategory: string;
  propertyType: string;
  propertySubType: string | null;
  state: string;
  user_liked: boolean,
  user_disliked: boolean;
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
  created_at: string;
  updated_at: string;
  companyBio: string | null;
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
  company_logo: string;
  dark_logo: string;
  name: string;
  company_bio: string;
  email: string;
  company_is_verified: boolean;
  company_status: string;
  join_ourproperty: string;
  total_branches: number;
  total_staff: number;
  total_property: number;
  total_unit: number;
  total_reviews: number;
  contact_details: {
    phone_numbers: string[];
  };
  addresses: {
    head_office_address: string;
    state: string;
    local_government: string;
    city: string;
    utility_document: string;
  };
  details: {
    joined_date: string;
    date_of_registration: string;
    cacRegistrationNumber: string;
    cacCertificate: string;
    industry: string;
    membershipNumber: string;
    membershipCertificate: string;
    company_type_id: number;
    property_for_sale: number;
    property_for_rent: number;
    hospitality_property: number;
    completed_transaction: number;
    total_reviews: number;
    total_branches: number;
    total_staff: number;
    total_unit_managing: number;
    completed_transaction: number;

  };
  social_handles: {
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
  profile_picture: string;
  name: string;
  tier: string;
  text: string;
  createdAt: string;
  likes?: number;
  dislikes?: number;
  user_liked: boolean;
  user_disliked: boolean;
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

export interface TransformedPropertyRequestData {
  agentRequest: PropertyRequest;
  contributor: Contributor;
  companySummary: CompanySummary;
  readByData: {
    name: string;
    profile_picture: string;
    email_verified: boolean;
    viewed_at: string;
  }[];
  comments: CommentProps[];
}
