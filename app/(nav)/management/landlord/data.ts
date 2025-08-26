// data.ts
import type { Field } from "@/components/Table/types";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { UserCardProps } from "@/components/Management/landlord-and-tenant-card";
import { PersonalDataProps } from "@/components/tasks/vehicles-record/form-sections";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { empty } from "@/app/config";

interface LandlordCardProps {
  id: string;
  name: string;
  email: string | null;
  user_tag: "mobile" | "web";
  phone_number: string | null; 
  picture_url: string | null;
  badge_color?: BadgeIconColors;
  note?: boolean;
}

export interface LandlordsPageData {
  total_landlords: number;
  new_landlords_this_month: number;
  mobile_landlords: number;
  new_mobile_landlords_this_month: number;
  web_landlords: number;
  new_web_landlords_this_month: number;
  total_pages: number;
  current_page: number;
  landlords: LandlordCardProps[];
}

export const initialLandlordsPageData: LandlordsPageData = {
  total_pages: 1,
  current_page: 1,
  total_landlords: 0,
  new_landlords_this_month: 0,
  mobile_landlords: 0,
  new_mobile_landlords_this_month: 0,
  web_landlords: 0,
  new_web_landlords_this_month: 0,
  landlords: [],
};

export const getOneLandlord = async (id: string) => {};

export const getLandlordsHelpInfo = async () => {
  try {
    const response = await fetch(
      `https://kb.ourproperty.ng/property-manager/api/helpinfo/landlord`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Check if the response status is ok (200-299)
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Parse the JSON data
    const res = await response.json();
    return { success: "True", res };
  } catch (error) {
    return { success: "False", error: (error as Error).message };
  }
};

export const landlordTableFields: Field[] = [
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

const generateMockdata = (numItems: number): LandlordCardProps[] => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture_url: "/empty/SampleLandlord.jpeg",
    name: "Sample name",
    user_tag: index % 2 === 0 ? "mobile" : "web",
    email: `test${index + 1}@test.com`,
    phone_number: `08012345678`,
    badge_color: index % 5 === 0 ? "black" : "red",
  }));
};

export const mockData = generateMockdata(10);

export interface LandlordApiResponse {
  data: {
    landlords: {
      id: string;
      name: string;
      email: string | null;
      // phone: string | null;
      phone: {
        user_phone: string | null;
        profile_phone: string | null;
      };
      username: string | null;
      picture: string;
      agent: string;
      tier_id?: 1 | 2 | 3 | 4 | 5;
      user_tier?: 1 | 2 | 3 | 4 | 5;
      note: {
        note: string | null;
      };
    }[];
    pagination: {
      current_page: number;
      per_page: number;
      total_pages: number;
    };
  };
  mobile_landlord_count: number;
  web_landlord_count: number;
  mobile_monthly_count: number;
  web_monthly_count: number;
  total_count_monthly: number;
  total_data_count: number;
}

export const transformLandlordApiResponse = (
  response: LandlordApiResponse
): LandlordsPageData => {
  // console.log("res", response)
  const {
    data: { landlords, pagination },
    mobile_landlord_count,
    web_landlord_count,
    mobile_monthly_count,
    web_monthly_count,
    total_count_monthly,
    total_data_count,
  } = response;
  return {
    total_landlords: total_data_count,
    new_landlords_this_month: total_count_monthly,
    mobile_landlords: mobile_landlord_count,
    new_mobile_landlords_this_month: mobile_monthly_count,
    web_landlords: web_landlord_count,
    new_web_landlords_this_month: web_monthly_count,
    total_pages: pagination.total_pages,
    current_page: pagination.current_page,
    landlords: landlords.map((landlord) => ({
      id: landlord.id,
      name: landlord.name,
      email: landlord.email,
      phone_number: `${landlord?.phone?.profile_phone || ""}${
        landlord?.phone?.user_phone && landlord?.phone?.profile_phone
          ? " / " + landlord?.phone?.user_phone
          : ""
      }`,
      // phone_number: landlord.phone,
      user_tag: landlord.agent.toLowerCase() === "mobile" ? "mobile" : "web",
      picture_url: landlord?.picture,
      note: landlord?.note?.note !== null && landlord?.note?.note !== "",

      badge_color: landlord?.user_tier
        ? tierColorMap[landlord?.user_tier]
        : undefined,
    })),
  };
};

export interface LandlordRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  states?: string;
  state?: string;
  start_date?: string;
  end_date?: string;
  date_from?: string;
  date_to?: string;
  agent?: string;
  branch_ids?: string;
  property_ids?: string;
  status?: string;
  tenant_ids?: string;
}

export const transformMobileUseData = (res: any): UserCardProps => {
  const { data } = res;
  const badgeColor =
    tierColorMap[data.tier.id as keyof typeof tierColorMap] || "green";
  return {
    id: data.id,
    name: data.name,
    picture_url: data.profile.picture,
    email: data.email,
    phone_number: data.profile.phone,
    user_tag: "mobile",
    badge_color: badgeColor,
  };
};

export const transformCardData = (data: any): UserCardProps => {
  return {
    name: data.name,
    picture_url: data.picture,
    email: data.email,
    phone_number: data.phone_number,
    user_tag: "web",
    badge_color: "green",
  };
};

export const transformMobileUseDataForVehicleRecord = (
  res: any
): PersonalDataProps => {
  const { data } = res;
  // console.log("res", data)
  const badgeColor =
    tierColorMap[data.tier.id as keyof typeof tierColorMap] || "green";
  return {
    id: data.id,
    full_name: data.name,
    state: data.profile.state,
    local_government: data.profile.lga,
    avatar: data.profile.picture,
    city: data.profile.city,
    phone_number: data.phone,
    address: data.profile.address,
  };
};

export const transformTenantUserData = (res: any): UserCardProps => {
  const { data } = res;
  // console.log("res", data);
  const badgeColor =
    tierColorMap[data.user_tier as keyof typeof tierColorMap] || "green";
  return {
    id: data?.id || "",
    name: data?.name || "",
    picture_url: data?.picture || empty,
    email: data?.email || "",
    phone_number: data?.phone?.profile_phone || data?.phone?.user_phone || "",
    user_tag: "mobile",
    badge_color: badgeColor,
  };
};
