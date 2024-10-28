import { TenantProps } from "@/components/Management/Tenants/types";
import type { Field } from "@/components/Table/types";

export const defaultTenantPageData: TenantPageData = {
  total_tenants: 0,
  new_tenants_this_month: 0,
  mobile_tenants: 0,
  new_mobile_tenants_this_month: 0,
  web_tenants: 0,
  new_web_tenants_this_month: 0,
  tenants: [],
};

export interface TenantPageData {
  total_tenants: number;
  new_tenants_this_month: number;
  mobile_tenants: number;
  new_mobile_tenants_this_month: number;
  web_tenants: number;
  new_web_tenants_this_month: number;
  tenants: TenantProps[];
}

export interface TenantPageState {
  gridView: boolean;
  total_pages: number;
  current_page: number;
  loading: boolean;
  error: Error | null;
  tenantsPageData: TenantPageData;
}

export const getAllTenants = async (
  accessToken: string | null
): Promise<TenantPageData> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tenants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching tenants", error);
    throw new Error(`Error: ${error}`);
  }
};

export const getOneTenant = async (tenantId: string, accessToken: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants/${tenantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching tenant", error);
    return null;
  }
};

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
      minWidth: 150,
      color: "#000",
    },
  },
  {
    id: "3",
    accessor: "email",
    cellStyle: {
      maxWidth: 200,
      wordBreak: "break-all",
    },
  },
  {
    id: "4",
    accessor: "phone_number",
  },
  { id: "5", accessor: "user_tag" },
  { id: "6", accessor: "manage/chat" },
];

const generateMockdata = (numItems: number) => {
  const colors = ["red", "green", "black", "blue", "yellow", "gray"];
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture_url: "/empty/SampleLandlord.jpeg",
    first_name: `first_name${index + 1}`,
    last_name: `last_name${index + 1}`,
    user_tag: index % 2 === 0 ? "mobile" : "web",
    email: `test${index + 1}@test.com`,
    phone_number: `08012345678`,
    badge_color: colors[index % colors.length],
  })) as TenantProps[];
};

export const mockData = generateMockdata(10);
