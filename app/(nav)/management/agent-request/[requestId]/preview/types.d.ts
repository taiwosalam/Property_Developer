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
  agentRequest: PropertyRequest;
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
