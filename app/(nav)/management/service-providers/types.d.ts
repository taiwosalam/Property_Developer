export interface ServiceProviderCard {
  email: string;
  user_tag: string;
  phone_number: string;
  avatar: string;
  other_info: string;
}

export interface initialServiceProviderPageData {
  total_user: number;
  this_month_user: number;
  providers: ServiceProviderCard[];
}

type TUserProfile = {
  id: number;
  user_id: number;
  company_id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string | null;
  company_email: string | null;
  company_phone: string | null;
  company_address: string;
  company_logo: string | null;
  service_render: string | null;
  address: string;
  state: string;
  local_government: string | null;
  avatar: string;
  agent: string;
  user_tier: number | null;
  bank_name: string | null;
  account_name: string | null;
  account_number: string | null;
  note: string | null;
  deleted_at: string | null;
};


interface Providers {
  current_page: number;
  last_page: number;
  data: TUserProfile[]
}
export interface ServiceProviderResponseApi {
  data: {
    total: number;
    total_month: number;
    total_web: number;
    total_web_month: number;
    total_mobile: number;
    total_mobile_month: number;
    providers: Providers;
  };
}

export interface ServiceProviderApiResponse {
  data: {
    total: number;
    total_month: number;
    total_web: number;
    total_web_month: number;
    total_mobile: number;
    total_mobile_month: number;
    providers: ProvidersPagination;
  };
}

export interface ServiceProviderFilterResponse {
  data: {
    current_page: number;
    providers: { data: ServiceProvider[]; last_page: number };
    total: number;
    total_month: number;
    total_web: number;
    total_web_month: number;
    total_mobile: number;
    total_mobile_month: number;
  };
}

export interface ServiceProviderPageData {
  total_pages: number;
  current_page: number;
  total: number;
  total_month: number;
  total_web: number;
  total_web_month: number;
  total_mobile: number;
  total_mobile_month: number;
  service_providers: ServiceProviderCardProps[];
}

interface ServiceProviderCardProps {
  id: number;
  name: string;
  email: string;
  phone: string;
  agent: string;
  avatar: string;
  badge_color: number | null;
  service_rendered: string | null;
  note: string | null;
}

type BadgeColor = "green" | "black" | "green" | "gray" | "red" | "yellow";

interface ProvidersPagination {
  current_page: number;
  data: ServiceProvider[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

interface ServiceProvider {
  id: number;
  user_id: number | null;
  company_id: number;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  company_phone: string;
  service_render: string;
  address: string;
  state: string;
  local_government: string;
  avatar: string;
  bank_name: string;
  account_name: string;
  account_number: string;
  note: string;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface ServiceProviderRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  account_type?: "web" | "mobile";
  all;
  start_date?: string;
  end_date?: string;
}

export interface FilterResult {
  options: string[];
  menuOptions: { [key: string]: string[] };
  startDate: string | null;
  endDate: string | null;
}

export interface ServiceProvidersFilterParams {
  page?: number;
  from_date?: string;
  to_date?: string;
  search: string;
  sort_by?: "desc";
  account_type?: string;
}
