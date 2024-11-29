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
  badge_color: BadgeIconColors;
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

export interface TenantPageState {
  gridView: boolean;
  tenantsPageData: TenantPageData;
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

const generateMockdata = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture_url: "/empty/SampleLandlord.jpeg",
    name: `Test ${index + 1}`,
    user_tag: index % 2 === 0 ? "mobile" : "web",
    email: `test${index + 1}@test.com`,
    phone_number: `08012345678`,
    // badge_color: tierColorMap[index % Object.keys(tierColorMap).length], NB: - I comment this cuz i have to push some things to main & this throw ts err
    badge_color:
      tierColorMap[
        (index % Object.keys(tierColorMap).length) as keyof typeof tierColorMap
      ],
  })) as TenantCardProps[];
};

export const mockData = generateMockdata(10);

export interface TenantApiResponse {
  data: {
    current_page: number;
    last_page: number;
    data: {
      id: number;
      name: string;
      email: string;
      phone: string;
      tier_id: number;
      picture: string;
      agent: string;
    }[];
  };
  total_tenants: number;
  new_tenants_this_month: number;
  mobile_tenants: number;
  new_mobile_tenants_this_month: number;
  web_tenants: number;
  new_web_tenants_this_month: number;
  message: string;
}

export const transformTenantApiResponse = (
  data: TenantApiResponse
): TenantPageData => {
  return {
    total_pages: data.data.last_page,
    current_page: data.data.current_page,
    total_tenants: data.total_tenants,
    new_tenants_this_month: data.new_tenants_this_month,
    mobile_tenants: data.mobile_tenants,
    new_mobile_tenants_this_month: data.new_mobile_tenants_this_month,
    web_tenants: data.web_tenants,
    new_web_tenants_this_month: data.new_web_tenants_this_month,
    tenants: data.data.data.map((tenant) => ({
      id: String(tenant.id),
      name: tenant.name,
      email: tenant.email,
      phone_number: tenant.phone,
      user_tag: tenant.agent.toLowerCase() === "mobile" ? "mobile" : "web",
      picture_url: tenant.picture,
      // badge_color: tierColorMap[tenant.tier_id] || "red", NB: - I comment this cuz i have to push some things to main & this throw ts err
      badge_color:
        tierColorMap[tenant.tier_id as keyof typeof tierColorMap] || "red",
    })),
  };
};
