import { TenantProps } from "@/components/Management/Tenants/types";

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

export const getAllTenants = async (): Promise<TenantPageData> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/tenants`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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

export const getOneTenant = async (tenantId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants/${tenantId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
    throw new Error(`Error: ${error}`);
  }
};
