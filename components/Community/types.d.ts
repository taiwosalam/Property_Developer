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
  cac_certificate: string;
  cac_registration_number: string;
  company_type_id: number;
  completed_transaction: number;
  date_of_registration: string;
  hospitality_property: number;
  industry: string;
  joined_date: string;
  membership_certificate: string;
  membership_number: string;
  property_for_rent: number;
  property_for_sale: number;
  total_branches: number;
  total_staff: number;
  total_unit_managing: number;
  total_review: number;
}

export interface Services {
  architect: null | string;
  civil_engineer: null | string;
  estate_surveyor_valuer: null | string;
  hospitality: null | string;
  land_surveyor: null | string;
  legal_practitioner: null | string;
  quantity_surveyor: null | string;
  realtor: null | string;
  town_planner: null | string;
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
  company_status: string;
  contact_details: ContactDetails;
  details: Details;
  email: string;
  join_ourproperty: string;
  name: string;
  services: Services;
  social_handles: SocialHandles;
  total_branch: number;
  total_property: number;
  total_review: number;
  total_staff: number;
  total_unit: number;
}
