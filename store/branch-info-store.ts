import { create } from "zustand";

export interface BranchInfoStoreState {
  branch_id: number | null;
  company_id: number | null;
  is_active: boolean;
  branch_name: string | null;
  picture: string | null;
  state: string | null;
  local_government: string | null;
  city: string | null;
  branch_desc: string | null;
  branch_address: string | null;
  email: string | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  staffs_count: number | null;
  properties_count: number | null;
  landlords_count: number | null;
  tenants_count: number | null;
  complaints_count: number | null;
  invoice_count: number | null;
  inquiry_count: number | null;
  current_month_inquiry_count: number | null;
  current_month_complaints_count: number | null;
  current_month_staffs_count: number | null;
  current_month_invoice_count: number | null;
  current_month_properties_count: number | null;
  current_month_landlords_count: number | null;
  current_month_tenants_count: number | null;
  receipt_statistic: {
    total_receipt: string | null;
    total_paid_receipt: string | null;
    total_pending_receipt: string | null;
    percentage_change_total: number | null;
    percentage_change_paid: number | null;
    percentage_change_pending: number | null;
  };
  staffs: Array<{
    id: number;
    user_id: number;
    is_active: boolean;
    title: string | null;
    professional_title: string | null;
    picture: string | null;
    staff_role: string | null;
    name: string | null;
    tier: number | null;
    online_status: string | null;
  }>;
  properties: Array<{
    id: number;
    branch_id: number;
    inventory_id: number | null;
    landlord_id: number | null;
    user_id: number;
    company_id: number;
    video_link: string | null;
    title: string | null;
    state: string | null;
    local_government: string | null;
    city_area: string | null;
    full_address: string | null;
    category: string | null;
    description: string | null;
    property_type: string | null;
    agency_fee: number | null;
    who_to_charge_new_tenant: string | null;
    who_to_charge_renew_tenant: string | null;
    caution_deposit: string | null;
    group_chat: boolean;
    rent_penalty: boolean;
    fee_penalty: boolean;
    request_call_back: boolean;
    book_visitors: boolean;
    vehicle_record: boolean;
    active_vat: boolean;
    currency: string | null;
    coordinate: string | null;
    management_fee: number | null;
    fee_period: string | null;
    is_featured: boolean;
    is_inventory: number | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
    image_count: number | null;
    unit_count: number | null;
    review_count: number | null;
    units: Array<{
      id: number;
      user_id: number;
      property_id: number;
      tenant_id: number;
      unit_name: string | null;
      unit_type: string | null;
      unit_sub_type: string | null;
      unit_preference: string | null;
      measurement: string | null;
      bedroom: string | null;
      bathroom: string | null;
      toilet: number | null;
      facilities: string | null;
      en_suit: boolean;
      prepaid: boolean;
      wardrobe: boolean;
      pet_allowed: boolean;
      total_area_sqm: string | null;
      number_of: string | null;
      fee_period: string | null;
      fee_amount: string | null;
      vat_amount: string | null;
      security_fee: string | null;
      service_charge: string | null;
      agency_fee: string | null;
      legal_fee: string | null;
      caution_fee: string | null;
      inspection_fee: string | null;
      management_fee: string | null;
      other_charge: string | null;
      negotiation: boolean;
      total_package: string | null;
      renew_fee_period: string | null;
      renew_fee_amount: string | null;
      renew_vat_amount: string | null;
      renew_service_charge: string | null;
      renew_other_charge: string | null;
      renew_total_package: string | null;
      renew_agency_fee: string | null;
      renew_security_fee: string | null;
      renew_legal_fee: string | null;
      renew_caution_fee: string | null;
      renew_inspection_fee: string | null;
      renew_management_fee: string | null;
      is_active: string | null;
      published: boolean;
      status: string | null;
      reject_reason: string | null;
      created_at: string | null;
      updated_at: string | null;
      deleted_at: string | null;
    }>;
  }>;
  activities: Array<{
    S_N: number;
    title: string | null;
    description: string | null;
    ip_address: string | null;
    location: {
      city: string | null;
      country: string | null;
      latitude: number | null;
      longitude: number | null;
    };
    created_at: string | null;
    updated_at: string | null;
    date: string | null;
    time: string | null;
  }>;
  created_at: string | null;
  updated_at: string | null;
  vacant_unit: number | null;
  vacant_month_unit: number | null;
  expired_unit: number | null;
  expired_month_unit: number | null;
  listing: number | null;
  listing_month: number | null;
  manager: {
    id: number | null;
    user_id: number | null;
    company_id: number | null;
    branch_id: number | null;
    is_active: boolean;
    title: string | null;
    professional_title: string | null;
    years_experience: string | null;
    staff_role: string | null;
    deleted_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    user: {
      id: number | null;
      encodedId: string | null;
      name: string | null;
      email: string | null;
      phone: string | null;
      username: string | null;
      referrer_code: string | null;
      email_verified_at: string | null;
      phone_verified_at: string | null;
      username_updated_at: string | null;
      is_active: boolean;
      is_company_owner: boolean;
      tier_id: number | null;
      last_seen: string | null;
      provider_id: string | null;
      provider_name: string | null;
      deleted_at: string | null;
      created_at: string | null;
      updated_at: string | null;
      is_verified: boolean;
      unread_messages_count: number | null;
      unread_notifications_count: number | null;
      profile_completion_status: string | null;
      is_subscription_expired: boolean;
      current_plan: string | null;
      current_subscription_expiry: string | null;
      profile: {
        id: number | null;
        user_id: number | null;
        type: string | null;
        name: string | null;
        email: string | null;
        phone: string | null;
        picture: string | null;
        background_image: string | null;
        title: string | null;
        gender: string | null;
        address: string | null;
        state: string | null;
        lga: string | null;
        city: string | null;
        bio: string | null;
        dob: string | null;
        religion: string | null;
        marital_status: string | null;
        occupation: string | null;
        job_type: string | null;
        family_type: string | null;
        facebook: string | null;
        x: string | null;
        instagram: string | null;
        linkedin: string | null;
        youtube: string | null;
        tiktok: string | null;
        website: string | null;
        note: string | null;
        bvn_link_at: string | null;
        created_at: string | null;
        updated_at: string | null;
        deleted_at: string | null;
        bvn_linked: boolean;
        completion_status: string | null;
      };
    };
  };
  sub_wallet: {
    wallet_id: string | null;
    balance: string | null;
    escrow_balance: string | null;
    is_active: string | null;
    pin_status: boolean;
    credit_total: number | null;
    debit_total: number | null;
    balance_total: string | null;
    last_week_credit: number | null;
    last_week_debit: number | null;
    last_week_balance: number | null;
    recent_transactions: Array<{
      id: number;
      amount: string | null;
      transaction_type: string | null;
      reference: string | null;
      description: string | null;
      status: string | null;
      balance_before: string | null;
      balance_after: string | null;
      source_name: string | null;
      date: string | null;
    }>;
  };
  recent_transactions: Array<{
    id: number;
    amount: string | null;
    transaction_type: string | null;
    reference: string | null;
    description: string | null;
    status: string | null;
    balance_before: string | null;
    balance_after: string | null;
    source_name: string | null;
    date: string | null;
  }>;
  setBranchInfo: <
    K extends keyof Omit<
      BranchInfoStoreState,
      "setBranchInfo" | "clearBranchInfo"
    >
  >(
    key: K,
    value: BranchInfoStoreState[K]
  ) => void;
  clearBranchInfo: () => void; // Add clearBranchInfo to the interface
}

const initialState: Omit<
  BranchInfoStoreState,
  "setBranchInfo" | "clearBranchInfo"
> = {
  branch_id: null,
  company_id: null,
  is_active: false,
  branch_name: null,
  picture: null,
  state: null,
  local_government: null,
  city: null,
  branch_desc: null,
  branch_address: null,
  email: null,
  bank_name: null,
  account_name: null,
  account_number: null,
  staffs_count: null,
  properties_count: null,
  landlords_count: null,
  tenants_count: null,
  complaints_count: null,
  invoice_count: null,
  inquiry_count: null,
  current_month_inquiry_count: null,
  current_month_complaints_count: null,
  current_month_staffs_count: null,
  current_month_invoice_count: null,
  current_month_properties_count: null,
  current_month_landlords_count: null,
  current_month_tenants_count: null,
  receipt_statistic: {
    total_receipt: null,
    total_paid_receipt: null,
    total_pending_receipt: null,
    percentage_change_total: null,
    percentage_change_paid: null,
    percentage_change_pending: null,
  },
  staffs: [],
  properties: [],
  activities: [],
  created_at: null,
  updated_at: null,
  vacant_unit: null,
  vacant_month_unit: null,
  expired_unit: null,
  expired_month_unit: null,
  listing: null,
  listing_month: null,
  manager: {
    id: null,
    user_id: null,
    company_id: null,
    branch_id: null,
    is_active: false,
    title: null,
    professional_title: null,
    years_experience: null,
    staff_role: null,
    deleted_at: null,
    created_at: null,
    updated_at: null,
    user: {
      id: null,
      encodedId: null,
      name: null,
      email: null,
      phone: null,
      username: null,
      referrer_code: null,
      email_verified_at: null,
      phone_verified_at: null,
      username_updated_at: null,
      is_active: false,
      is_company_owner: false,
      tier_id: null,
      last_seen: null,
      provider_id: null,
      provider_name: null,
      deleted_at: null,
      created_at: null,
      updated_at: null,
      is_verified: false,
      unread_messages_count: null,
      unread_notifications_count: null,
      profile_completion_status: null,
      is_subscription_expired: false,
      current_plan: null,
      current_subscription_expiry: null,
      profile: {
        id: null,
        user_id: null,
        type: null,
        name: null,
        email: null,
        phone: null,
        picture: null,
        background_image: null,
        title: null,
        gender: null,
        address: null,
        state: null,
        lga: null,
        city: null,
        bio: null,
        dob: null,
        religion: null,
        marital_status: null,
        occupation: null,
        job_type: null,
        family_type: null,
        facebook: null,
        x: null,
        instagram: null,
        linkedin: null,
        youtube: null,
        tiktok: null,
        website: null,
        note: null,
        bvn_link_at: null,
        created_at: null,
        updated_at: null,
        deleted_at: null,
        bvn_linked: false,
        completion_status: null,
      },
    },
  },
  sub_wallet: {
    wallet_id: null,
    balance: null,
    escrow_balance: null,
    is_active: null,
    pin_status: false,
    credit_total: null,
    debit_total: null,
    balance_total: null,
    last_week_credit: null,
    last_week_debit: null,
    last_week_balance: null,
    recent_transactions: [],
  },
  recent_transactions: [],
};

export const useBranchInfoStore = create<BranchInfoStoreState>((set) => ({
  ...initialState,
  setBranchInfo: (key, value) => set({ [key]: value }),
  clearBranchInfo: () => set(initialState),
}));
