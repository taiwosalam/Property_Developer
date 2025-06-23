export interface Address {
  city: string;
  head_office_address: string;
  local_government: string;
  state: string;
  utility_document: string;
}

export interface ContactDetails {
  phone_numbers: any[];
}

export interface Details {
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
    total_review: number;
    total_branches: number;
    total_staff: number;
    total_unit_managing: number;
    completed_transaction: number;
}

export interface Services {
  
  // architect: null | string;
  // civil_engineer: null | string;
  // estate_surveyor_valuer: null | string;
  // hospitality: null | string;
  // land_surveyor: null | string;
  // legal_practitioner: null | string;
  // quantity_surveyor: null | string;
  // realtor: null | string;
  // town_planner: null | string;
}

export interface SocialHandles {
  facebook: null | string;
  instagram: null | string;
  linkedin: null | string;
  tiktok: null | string;
  website: null | string;
  x: null | string;
  youtube: null | string;
}

export interface CompanySummaryTypes {
  addresses: Address;
  company_is_verified: boolean;
  company_logo: string;
  dark_logo: string;
  company_status: string;
  contact_details: ContactDetails;
  details: Details;
  email: string;
  join_ourproperty: string;
  name: string;
  services: string[];
  social_handles: SocialHandles;
  total_branches: number;
  total_property: number;
  total_review: number;
  total_staff: number;
  total_unit: number;
}


// export interface CompanySummaryTypes {
//   addresses: Address;
//   companyIsVerified: boolean;
//   companyLogo: string;
//   companyStatus: string;
//   contactDetails: ContactDetails;
//   details: Details;
//   email: string;
//   joinOurproperty: string;
//   name: string;
//   services: Services;
//   socialHandles: SocialHandles;
//   totalBranch: number;
//   totalProperty: number;
//   totalReview: number;
//   totalStaff: number;
//   totalUnit: number;
// }
