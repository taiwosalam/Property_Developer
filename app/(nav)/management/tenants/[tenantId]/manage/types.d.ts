import { Currency } from "@/utils/number-formatter";

// Define types based on the API response
interface DocumentFile {
  url: string;
  name?: string;
  updated_at?: string;
}

interface Document {
  id: number;
  unit_id: number;
  property_id: number | null;
  profile_id: number;
  type: string;
  thumbnail: string | null;
  files: DocumentFile[];
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface Unit {
  unit: {
    id: number;
    user_id: number;
    property_id: number;
    tenant_id: number;
    unit_name: string;
    unit_type: string;
    unit_sub_type: string | null;
    unit_preference: string;
    measurement: string;
    bedroom: string;
    bathroom: string;
    toilet: number;
    facilities: string[] | null;
    en_suit: boolean;
    prepaid: boolean;
    wardrobe: boolean;
    pet_allowed: boolean;
    total_area_sqm: string;
    number_of: string;
    fee_period: string;
    fee_amount: string;
    vat_amount: string;
    security_fee: string;
    service_charge: string;
    agency_fee: string;
    legal_fee: string;
    caution_fee: string;
    inspection_fee: string;
    management_fee: string | null;
    other_charge: string;
    negotiation: boolean;
    total_package: string;
    renew_fee_period: string;
    renew_fee_amount: string;
    renew_vat_amount: string;
    renew_service_charge: string;
    renew_other_charge: string;
    renew_total_package: string;
    renew_agency_fee: string;
    renew_security_fee: string;
    renew_legal_fee: string | null;
    renew_caution_fee: string | null;
    renew_inspection_fee: string | null;
    renew_management_fee: string | null;
    is_active: string;
    published: boolean;
    status: string;
    reject_reason: string | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    images: Array<{
      id: number;
      path: string;
      is_default: number;
      mediaable_type: string;
      mediaable_id: number;
      created_at: string;
      updated_at: string;
      url: string;
    }>;
    property: {
      id: number;
      branch_id: number;
      inventory_id: number | null;
      landlord_id: number | null;
      user_id: number;
      company_id: number;
      video_link: string | null;
      title: string;
      state: string;
      local_government: string;
      city_area: string;
      full_address: string;
      category: string;
      description: string;
      property_type: string;
      agency_fee: number;
      who_to_charge_new_tenant: string;
      who_to_charge_renew_tenant: string;
      caution_deposit: string;
      group_chat: boolean;
      rent_penalty: boolean;
      fee_penalty: boolean;
      request_call_back: boolean;
      book_visitors: boolean;
      vehicle_record: boolean;
      active_vat: boolean;
      currency: string;
      coordinate: string | null;
      management_fee: number;
      fee_period: string | null;
      is_featured: boolean;
      is_inventory: number;
      created_at: string;
      updated_at: string;
      deleted_at: string | null;
      image_count: number;
      unit_count: number;
      review_count: number;
    };
    attachments: Document[];
  };
  images: Array<{
    id: number;
    path: string;
    is_default: number;
    mediaable_type: string;
    mediaable_id: number;
    created_at: string;
    updated_at: string;
    url: string;
  }>;
  property: {
    id: number;
    branch_id: number;
    inventory_id: number | null;
    landlord_id: number | null;
    user_id: number;
    company_id: number;
    video_link: string | null;
    title: string;
    state: string;
    local_government: string;
    city_area: string;
    full_address: string;
    category: string;
    description: string;
    property_type: string;
    agency_fee: number;
    who_to_charge_new_tenant: string;
    who_to_charge_renew_tenant: string;
    caution_deposit: string;
    group_chat: boolean;
    rent_penalty: boolean;
    fee_penalty: boolean;
    request_call_back: boolean;
    book_visitors: boolean;
    vehicle_record: boolean;
    active_vat: boolean;
    currency: string;
    coordinate: string | null;
    management_fee: number;
    fee_period: string | null;
    is_featured: boolean;
    is_inventory: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    image_count: number;
    unit_count: number;
    review_count: number;
  };
  document: Document[];
}

export interface CurrentRent {
  id: number;
  unit_id: number;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string | null;
  unit_preference: string;
  rent_amount: string;
  service_charge: string;
  caution_deposit: string;
  due_date: string;
  tenant_name: string;
  tenant_picture: string;
  tenant_tier: number;
  property_type: string;
  unit_status: string;
  rent_type: string;
  invoice_status: string;
  invoice_id: number;
  partial_pending: boolean;
  property_name: string;
  currency: Currency;
  property_description: string;
  property_category: string;
  unit_image: Array<{ path: string }>;
  document: Document[];
}

export interface PreviousRent {
  id: number;
  unit_id: number;
  unit_name: string;
  unit_type: string;
  unit_sub_type: string | null;
  unit_preference: string;
  rent_amount: string;
  service_charge: string;
  caution_deposit: string;
  due_date: string;
  tenant_name: string;
  tenant_picture: string;
  tenant_tier: number;
  property_type: string;
  unit_status: string;
  rent_type: string;
  invoice_status: string;
  invoice_id: number;
  partial_pending: boolean;
  property_name: string;
  currency: string;
  property_description: string;
  property_category: string;
  unit_image: Array<{ path: string }>;
  document: Document[];
}

interface UnitItemProps {
  propertyType: string;
  caution_deposit: number;
  property_name: string;
  unitId: string;
  unitImages: string[];
  unitDetails: string;
  unitStatus: keyof typeof UnitStatusColors;
  unitName: string;
  rent: string;
  serviceCharge: string;
  cautionDeposit: string;
  tenantName: string;
  title: string;
  tenantBadgeColor?: string;
  dueDate: string;
  documents: Array<{
    id: string;
    name: string;
    link: string;
    document_type: string;
    date?: string;
    isShared?: boolean; // To distinguish shared vs unit-specific documents
  }>;
  tenantId?: string;
  page?: string;
  tenantAgent?: string;
  noActionBtn?: boolean;
}

interface TenantData {
  id: string;
  picture: string;
  name: string;
  title: string;
  user_id: string;
  email: string;
  user_tag: "mobile" | "web";
  badge_color?: string;
  phone_number: string;
  tenant_type: string;
  gender: string;
  birthdate: string;
  religion: string;
  marital_status: string;
  is_flagged: boolean;
  flag?: {
    is_flagged: boolean;
    reason: string;
    flagged_by: string;
  };
  contact_address: {
    address: string;
    city: string;
    state: string;
    local_govt: string;
  };
  next_of_kin: Record<string, string>;
  others: Record<string, string>;
  bank_details: Record<string, string> | Record<string, string>[];
  notes: {
    last_updated: string;
    write_up: string;
  };
  note: boolean;
  guarantor_1: Record<string, string>;
  guarantor_2: Record<string, string>;
  documents: Array<{
    id: string;
    name: string;
    link: string;
    document_type: string;
    date?: string;
  }>;
  current_rent: UnitItemProps[];
  previous_rent: UnitItemProps[];
  statement: Array<{
    id: number;
    payment_date: string;
    amount_paid: string;
    details: string;
    date: string;
    start_date: string;
    invoice_id: string;
    end_date: string;
    unit_name: string;
    unit_type: string;
    unit_sub_type: string | null;
    unit_reference: string;
    currency: string;
    "S/N": string;
  }>;
  messageUserData: {
    id: number;
    name: string;
    position: string;
    imageUrl: string;
    branch_id: number;
  };
  unitOptions: Array<{ label: string; value: string }>;
}

export interface IndividualTenantAPIResponse {
  status: string;
  statusCode: number;
  data: {
    id: string;
    user_id: number;
    name: string;
    email: string;
    phone: {
      profile_phone: string;
      user_phone: string;
    };
    title: string | null;
    username: string;
    gender: string;
    birthday: string;
    marital_status: string;
    religion: string;
    tenant_type: string | null;
    state: string;
    local_government: string;
    user_tier: number;
    city: string;
    address: string;
    picture: string;
    agent: string;
    profile_id: number;
    branch_id: number | null;
    company_id: number;
    signature: string;
    flags: Array<{
      is_flagged: boolean;
      reason: string | null;
      flagged_by: string;
    }>;
    bank_details: Record<string, string>;
    Others: {
      occupation: string;
      job_type: string;
      family_type: string;
    };
    next_of_kin: Record<string, string>;
    note: {
      id: number | null;
      note: string | null;
      last_updated_at: string | null;
    };
    documents: Array<{
      thumbnail: string | null;
      type: string;
      files: Array<{
        url: string;
        name?: string;
        updated_at?: string;
      }>;
    }>;
    units: Unit[];
    guarantor: Array<Record<string, string>>;
    current_rent: CurrentRent[];
    previous_rent: PreviousRent[];
    statement: Array<{
      id: number;
      payment_date: string;
      amount_paid: string;
      details: string;
      date: string;
      start_date: string;
      invoice_id: string;
      end_date: string;
      unit_name: string;
      unit_type: string;
      unit_sub_type: string | null;
      unit_reference: string;
      currency: string;
    }>;
    created_at: string;
    updated_at: string;
  };
  message: string;
}