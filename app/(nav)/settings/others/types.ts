export type ApiResponseDirector = {
  success: boolean;
  message: string;
  data: {
    directors: Director[];
    company_signature: string | null;
    company_bank: CompanyBank[];
    smtp_settings: SmtpSettings;
  };
};

type Director = {
  id: number;
  user_id: number;
  company_id: number;
  personal_title: string | null;
  years_in_business: string | null;
  professional_title: string;
  phone_number: string;
  about_director: string | null;
  profile_picture: string | null;
  is_verified: boolean;
  full_name: string;
  alt_email: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  user: User;
};

type User = {
  id: number;
  encodedId: string;
  name: string;
  email: string;
  phone: string | null;
  username: string | null;
  referrer_code: string | null;
  email_verified_at: string | null;
  phone_verified_at: string | null;
  username_updated_at: string | null;
  profile: {
    picture: string;
    title: string;
    state: string | null;
    lga: string | null;
    bvn: string | null;
  };
  is_active: boolean;
  is_company_owner: number;
  tier_id: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  provider_id: string | null;
  provider_name: string | null;
};

type CompanyBank = {
  id: number;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  is_default: number;
  bankable_type: string;
  bankable_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type ApiResponseUserPlan = {
  status: "success" | "error";
  data: SubscriptionData;
};

type SubscriptionData = {
  id: number;
  user_id: number;
  property_plan_id: number;
  quantity: number;
  amount: string;
  start_date: string;
  end_date: string | null;
  status: "active" | "inactive" | "expired"; // Adjust based on possible statuses
  created_at: string;
  updated_at: string;
  plan: Plan;
};

type Plan = {
  id: number;
  plan_name: string;
  description: string;
  plan_price: string;
  duration: string;
  discount_percentage: number;
  branch_limit: number;
  director_limit: number;
  staff_limit: number;
  property_limit: number;
  unit_listing_limit: number;
  tenant_occupant_limit: number;
  is_addon: number;
  is_free: number;
  is_active: number;
  created_at: string;
  updated_at: string;
};

// Appearance settings
interface AppearanceSettings {
  card: string; // e.g., "list"
  fonts: string; // e.g., "Lato"
  theme: string; // e.g., "theme1"
  navbar: string; // e.g., "column"
  colorMode: string; // e.g., "light"
  dashboardColor: string; // e.g., "#000000"
}

// Messages and review settings
interface MessagesReviewSettings {
  reviews: boolean;
  messages: boolean;
  assign_staff: boolean;
  account_officer: boolean;
  landlord_landlady: boolean;
}

// Notification settings
interface NotificationSettings {
  new_messages: boolean;
  task_updates: boolean;
  profile_changes: boolean;
  property_vacant: boolean;
  profile_approval: boolean;
  document_creation: boolean;
  property_approval: boolean;
}

type TypographySettings = {
  fontSize: string; // Ensuring fontSize is always a string
  fontWeight?: string; // Optional and as a string
};

type WebsiteTypography = {
  H1: TypographySettings;
  H2: TypographySettings;
  H3: TypographySettings;
  H4: TypographySettings;
  H5: TypographySettings;
  H6: TypographySettings;
  "Body Font": TypographySettings;
  "Site Title": TypographySettings;
};

// Website settings
interface WebsiteSettings {
  color_scheme: string; // e.g., "default"
  fonts_template: string; // e.g., "default"
  sponsored_logo: boolean;
  typography: WebsiteSettings;
  web_template: string;
  rent_properties: boolean;
  sale_properties: boolean;
  shortlet_properties: boolean;
  website_font: string;
  modules_listing: boolean;
  about_us_display: boolean;
  services_contact_page: boolean;
  staffs_branch_options: boolean;
  social_link_visibility: boolean;
}

// SMTP settings
interface SmtpSettings {
  from_name: string;
  smtp_host: string;
  smtp_port: string; // Stored as string, e.g., "587"
  from_address: string;
  smtp_password: string;
  smtp_username: string;
  email_protocol: string; // e.g., "smtp"
  email_encryption: string; // e.g., "tls"
}

// Rent penalty settings
// ...existing code...

// Rent penalty settings
export interface RentPenaltySetting {
  daily: number;
  weekly: number;
  monthly: number;
  quarterly: number;
  yearly: number;
  biennially: number;
  triennially: number;
  quadrennial: number;
  quinquennial: number;
  sexennial: number;
  septennial: number;
  octennial: number;
  nonennial: number;
  decennial: number;
}

// ...existing code...

// Screening levels
interface ScreeningLevels {
  tenant_screening_level: number; // e.g., 1
  occupant_screening_level: number; // e.g., 1
}

// Data object containing all settings
interface CompanySettingsData {
  company_id: number; // e.g., 6
  appearance: AppearanceSettings;
  company_default_module: number;
  messages_review_settings: MessagesReviewSettings;
  notifications: NotificationSettings;
  website_settings: WebsiteSettings;
  sms_name: string; // e.g., ""
  smtp_settings: SmtpSettings;
  domain: string | null; // e.g., null
  custom_domain: string | null;
  custom_domain_status: string | null;
  custom_domain_ssl_status: string | null;
  rent_penalty_setting: RentPenaltySetting;
  zoom_moderation: boolean;
  subscription_due_rent_notification: boolean;
  general_notification: boolean;
  sms_notification: boolean;
  updated_at: string;
  created_at: string;
  email_notification: boolean;
  screening_levels: ScreeningLevels;
}

// Final response type
export interface CompanySettingsResponse {
  status: boolean; // e.g., true
  message: string; // e.g., "Company settings fetched successfully."
  data: CompanySettingsData;
}

export interface IPropertyApi {
  data: {
    properties: {
      data: [
        {
          id: number;
          title: string;
        }
      ];
    };
  };
}
export interface ITenantsApi {
  data: {
    tenants: [{ id: number; name: string }];
  };
}

export interface ITenantResponse {
  data: {
    id: number;
    name: string;
    phone: {
      profile_phone: string | null;
      user_phone: string | null;
    };
    agent: string;
    picture: string;
    email: string;
  };
}

export type RestrictedTenant = {
  id: number;
  model: string;
  name: string;
  email: string;
  phone: string;
  picture: string;
  user_id: number | null;
  agent: string;
  tenant_type: string;
  is_active: number;
  profile_id: number;
  branch_id: number | null;
  company_id: number;
};

export type RestrictedUserApiResponse = {
  status: string;
  message: string;
  data: RestrictedTenant[];
};
