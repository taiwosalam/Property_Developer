

export type UnitListingApiResponse = {
    status: string;
    total_unit: number;
    published: number;
    unpublished: number;
    under_moderation: number;
    total_occupied: number;
    total_vacant: number;
    total_active: number;
    total_expired: number;
    total_relocate: number;
    month_unit: number;
    month_occupied: number;
    month_vacant: number;
    month_active: number;
    month_expired: number;
    month_relocate: number;
    units: Unit[];
    pagination: Pagination;
  };
  
  type Unit = {
    id: number;
    user_id: number;
    property_id: number;
    tenant_id: number;
    unit_name: string;
    unit_type: string;
    unit_sub_type: string;
    unit_preference: string;
    measurement: string;
    bedroom: string;
    bathroom: string;
    toilet: number;
    facilities: string | null;
    en_suit: number;
    prepaid: number;
    wardrobe: number;
    pet_allowed: number;
    total_area_sqm: string;
    number_of: string;
    fee_period: string;
    fee_amount: string;
    security_fee: string;
    service_charge: string;
    agency_fee: string;
    legal_fee: string;
    caution_fee: string;
    inspection_fee: string;
    management_fee: string | null;
    other_charge: string;
    negotiation: number;
    total_package: string;
    renew_fee_period: string | null;
    renew_fee_amount: string;
    renew_service_charge: string;
    renew_other_charge: string;
    renew_total_package: string;
    is_active: string;
    published: number;
    status: string;
    reject_reason: string | null;
    created_at: string;
    updated_at: string;
    images: Image[];
    property: Property;
    occupant?: Occupant;
  };
  
  type Image = {
    id: number;
    path: string;
    is_default: number;
    mediaable_type: string;
    mediaable_id: number;
    created_at: string;
    updated_at: string;
  };
  
  type Property = {
    id: number;
    video_link: string | null;
    title: string;
    state: string;
    local_government: string;
    city_area: string;
    full_address: string;
    category: string;
    description: string;
    property_type: string;
    currency: string | null;
    branch: Branch;
    company: Company;
  };
  
  type Branch = {
    id: number;
    company_id: number;
    manager_id: number | null;
    has_wallet: number;
    branch_name: string;
    is_active: number;
    picture: string;
    state: string;
    local_government: string;
    city: string;
    branch_desc: string;
    branch_address: string;
    email: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
  
  type Company = {
    id: number;
    user_id: number;
    company_type_id: number;
    company_name: string;
    referrer: string | null;
    referral: string;
    email: string;
    email_verified_at: string;
    company_logo: string;
    dark_logo: string | null;
    is_verified: boolean;
    phone_number: string[];
    head_office_address: string;
    state: string;
    local_government: string;
    city: string;
    utility_document: string;
    date_of_registration: string;
    cac_registration_number: string;
    cac_certificate: string;
    industry: string;
    membership_number: string;
    membership_certificate: string;
    status: string;
    reject_reason: string | null;
    facebook: string | null;
    x: string | null;
    instagram: string | null;
    linkedin: string | null;
    youtube: string | null;
    tiktok: string | null;
    website: string | null;
    bio: string | null;
    status_updated_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    wallet: Wallet;
    directors: Director[];
  };
  
  type Wallet = {
    id: number;
    encodedId: string;
    walletable_type: string;
    walletable_id: number;
    balance: string;
    escrow_balance: string;
    earned_bonus: string;
    paystack_account_number: string;
    paystack_account_name: string;
    paystack_bank_name: string;
    paystack_customer_code: string;
    pin: string;
    is_active: number;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  
  type Director = {
    id: number;
    user_id: number;
    company_id: number;
    personal_title: string;
    years_in_business: string;
    phone_number: string;
    about_director: string;
    profile_picture: string;
    full_name: string;
    alt_email: string | null;
    deleted_at: string | null;
    created_at: string;
    updated_at: string;
  };
  
  type Occupant = {
    name: string;
    expiry: string;
  };
  
  type Pagination = {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };

  export interface UnitListingRequestParams {
    page?: number;
    search?: string;
    sort_order?: "asc" | "desc";
    account_type?: "web" | "mobile";
    start_date?: string;
    end_date?: string;
  }
  