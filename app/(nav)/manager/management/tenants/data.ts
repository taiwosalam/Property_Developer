import type { Field } from "@/components/Table/types";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
interface TenantCardProps {
  id: string;
  name: string;
  title: string;
  email: string;
  phone_number: string;
  user_tag: "mobile" | "web";
  picture_url: string;
  badge_color?: BadgeIconColors;
  note?: boolean;
  flagged?: boolean;
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
      title: string;
      email: string;
      // phone: string;
      phone: {
        profile_phone: string | null;
        user_phone: string | null;
      };
      picture: string;
      agent: string;
      user_tier: 1 | 2 | 3 | 4 | 5;
      note: {
        note: string | null;
      };
      flags: {
        is_flagged: boolean;
        flagged_by: string;
        reason: string | null;
      }[];
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
      title: tenant.title,
      email: tenant.email,
      phone_number: `${tenant.phone.profile_phone ?? ""}${
        tenant.phone.user_phone && tenant.phone.profile_phone
          ? " / " + tenant.phone.user_phone
          : ""
      }`,
      // phone_number: tenant.phone,
      user_tag: tenant.agent?.toLowerCase() === "mobile" ? "mobile" : "web",
      picture_url: tenant.picture,
      note: tenant.note.note !== null && tenant.note.note !== "",
      // flagged: tenant?.is_flagged,
      flagged: tenant.flags?.some(flag => flag.is_flagged) ?? false,
      badge_color: tenant.user_tier
        ? tierColorMap[tenant.user_tier]
        : undefined,
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

export const tenantRejectOptions = [
  "Consistent Late Rent Payments: Frequent failure to pay rent on time, causing disruptions to the payment schedule.",
  "Non-Payment of Rent: Missed rent payments without resolution.",
  "Property Damage: Intentional or careless damage caused to the property.",
  "Violation of Lease Terms: Breach of rules outlined in the lease agreement.",
  "Noise Complaints from Neighbors: Reports of excessive or disruptive noise from neighboring residents.",
  "Unauthorized Occupants: Unapproved individuals residing in the unit without management's consent.",
  "Subletting Without Permission: Subletting of the property without prior landlord approval.",
  "Illegal Activities on Property: Suspicion or evidence of unlawful behavior occurring on the premises.",
  "Harassment or Threats to Neighbors or Staff: Aggressive, threatening, or inappropriate conduct toward others.",
  "Tampering with Utilities or Safety Equipment: Interference with systems such as smoke detectors, water meters, or electrical panels.",
  "Unauthorized Pets: Keeping pets in the unit without permission, violating lease terms.",
  "Unauthorized Pets: Keeping pets in the unit without permission, violating lease terms.",
  "Refusing Property Inspections or Maintenance Access: Repeated denial of access for inspections or maintenance services.",
  "Hosting Large Parties or Events Without Notice: Unapproved gatherings causing disturbances or policy violations.",
  "Improper Disposal of Waste: Incorrect disposal of garbage, leading to hygiene or pest issues.",
  "Neglecting Property Cleanliness: Maintaining the property in an unclean or hazardous condition.",
  "Use of Property for Commercial Purposes Without Approval: Operating a business from the unit without appropriate approval.",
  "Repeated Complaints from Other Occupants or Neighbors: Ongoing or multiple complaints reported by others.",
  "Providing False Information During Application or Lease Renewal: Submission of inaccurate or misleading details during application or renewal.",
];
