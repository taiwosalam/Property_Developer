import type { Field } from "@/components/Table/types";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
interface TenantCardProps {
  id: string;
  name: string;
  email: string;
  phone_number: string;
  user_tag: "mobile" | "web";
  picture_url: string;
  badge_color?: BadgeIconColors;
}

export const defaultTenantPageData: TenantPageData = {
  total_pages: 1,
  current_page: 1,
  total_tenants: 0,
  new_tenants_this_month: 0,
  mobile_tenants: 0,
  new_mobile_tenants_this_month: 0,
  web_tenants: 0,
  new_web_tenants_this_month: 0,
  tenants: [],
};

export interface TenantPageData {
  total_pages: number;
  current_page: number;
  total_tenants: number;
  new_tenants_this_month: number;
  mobile_tenants: number;
  new_mobile_tenants_this_month: number;
  web_tenants: number;
  new_web_tenants_this_month: number;
  tenants: TenantCardProps[];
}

export const getOneTenant = async (tenantId: string) => {};

export const tenantTableFields: Field[] = [
  {
    id: "1",
    accessor: "picture_url",
    isImage: true,
    cellStyle: { paddingRight: "4px" },
  },
  {
    id: "2",
    accessor: "full_name",
    cellStyle: {
      paddingLeft: "4px",
      fontWeight: 700,
      color: "#000",
    },
  },
  {
    id: "3",
    accessor: "email",
    cellStyle: {
      whiteSpace: "nowrap",
    },
  },
  {
    id: "4",
    accessor: "phone_number",
    cellStyle: {
      whiteSpace: "nowrap",
    },
  },
  { id: "5", accessor: "user_tag" },
  { id: "6", accessor: "manage/chat" },
];

export interface TenantApiResponse {
  data: {
    pagination: {
      current_page: number;
      total_pages: number;
      per_page: number;
    };
    tenants: {
      id: string;
      name: string;
      email: string;
      phone: string;
      picture: string;
      agent: string;
      tier_id?: 1 | 2 | 3 | 4 | 5;
    }[];
  };
  mobile_tenant_count: number;
  web_tenant_count: number;
  mobile_monthly_count: number;
  web_monthly_count: number;
  total_count_monthly: number;
  total_data_count: number;
}

export const transformTenantApiResponse = (
  response: TenantApiResponse
): TenantPageData => {
  // console.log("res", response)
  const {
    data: { pagination, tenants },
    mobile_tenant_count,
    web_tenant_count,
    mobile_monthly_count,
    web_monthly_count,
    total_count_monthly,
    total_data_count,
  } = response;
  return {
    total_pages: pagination.total_pages,
    current_page: pagination.current_page,
    total_tenants: total_data_count,
    new_tenants_this_month: total_count_monthly,
    mobile_tenants: mobile_tenant_count,
    new_mobile_tenants_this_month: mobile_monthly_count,
    web_tenants: web_tenant_count,
    new_web_tenants_this_month: web_monthly_count,
    tenants: tenants.map((tenant) => ({
      id: tenant.id,
      name: tenant.name,
      email: tenant.email,
      phone_number: tenant.phone,
      user_tag: tenant.agent?.toLowerCase() === "mobile" ? "mobile" : "web",
      picture_url: tenant.picture,
      badge_color: tenant.tier_id ? tierColorMap[tenant.tier_id] : undefined,
    })),
  };
};

export interface TenantRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  states?: string;
  start_date?: string;
  end_date?: string;
  agent?: string;
  branch_ids?: string;
}
