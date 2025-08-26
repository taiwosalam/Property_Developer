// data.ts
import type { Field } from "@/components/Table/types";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import { UserCardProps } from "@/components/Management/landlord-and-tenant-card";
import { PersonalDataProps } from "@/components/tasks/vehicles-record/form-sections";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";
import { empty } from "@/app/config";

interface ClientCardProps {
  id: string;
  name: string;
  email: string | null;
  user_tag: "mobile" | "web";
  phone_number: string | null;
  picture_url: string | null;
  badge_color?: BadgeIconColors;
  note?: boolean;
}

export interface ClientsPageData {
  total_clients: number;
  new_clients_this_month: number;
  mobile_clients: number;
  new_mobile_clients_this_month: number;
  web_clients: number;
  new_web_clients_this_month: number;
  total_pages: number;
  current_page: number;
  clients: ClientCardProps[];
}

export const initialClientsPageData: ClientsPageData = {
  total_pages: 1,
  current_page: 1,
  total_clients: 0,
  new_clients_this_month: 0,
  mobile_clients: 0,
  new_mobile_clients_this_month: 0,
  web_clients: 0,
  new_web_clients_this_month: 0,
  clients: [],
};

export const getOneClient = async (id: string) => { };

export const getClientsHelpInfo = async () => {
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

export const clientTableFields: Field[] = [
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

const generateMockdata = (numItems: number): ClientCardProps[] => {
  const names = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emily Davis",
    "David Wilson",
    "Lisa Anderson",
    "Robert Taylor",
    "Jennifer Martinez",
    "William Garcia",
    "Amanda Rodriguez"
  ];

  const emails = [
    "john.smith@email.com",
    "sarah.j@email.com",
    "mike.brown@email.com",
    "emily.davis@email.com",
    "david.wilson@email.com",
    "lisa.anderson@email.com",
    "robert.t@email.com",
    "jen.martinez@email.com",
    "will.garcia@email.com",
    "amanda.rod@email.com"
  ];

  const phoneNumbers = [
    "08012345678",
    "08023456789",
    "08034567890",
    "08045678901",
    "08056789012",
    "08067890123",
    "08078901234",
    "08089012345",
    "08090123456",
    "08001234567"
  ];

  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture_url: "/empty/SampleLandlord.jpeg",
    name: names[index % names.length],
    user_tag: index % 2 === 0 ? "mobile" : "web",
    email: emails[index % emails.length],
    phone_number: phoneNumbers[index % phoneNumbers.length],
    badge_color: index % 5 === 0 ? "black" : index % 3 === 0 ? "red" : "green",
    note: index % 7 === 0, // Some clients have notes
  }));
};

export const mockData = generateMockdata(10);

// Generate dummy API response data for development/testing
export const generateDummyClientApiResponse = (page: number = 1, search?: string): ClientApiResponse => {
  const totalItems = 50; // Total dummy clients
  const perPage = 10;
  const totalPages = Math.ceil(totalItems / perPage);

  // Filter clients if search is provided
  let filteredClients = generateMockdata(totalItems);
  if (search) {
    filteredClients = filteredClients.filter(client =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email?.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Paginate results
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;
  const paginatedClients = filteredClients.slice(startIndex, endIndex);

  // Transform to API response format
  const apiClients = paginatedClients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: {
      user_phone: client.phone_number,
      profile_phone: client.phone_number,
    },
    username: client.name.toLowerCase().replace(' ', '.'),
    picture: client.picture_url,
    agent: client.user_tag,
    tier_id: client.badge_color === "black" ? 1 : client.badge_color === "red" ? 2 : 3,
    user_tier: client.badge_color === "black" ? 1 : client.badge_color === "red" ? 2 : 3,
    note: {
      note: client.note ? "Important client note" : null,
    },
  }));

  return {
    data: {
      clients: apiClients as any,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_pages: totalPages,
      },
    },
    mobile_client_count: Math.floor(totalItems * 0.6), // 60% mobile
    web_client_count: Math.floor(totalItems * 0.4), // 40% web
    mobile_monthly_count: Math.floor(totalItems * 0.1), // 10% new this month
    web_monthly_count: Math.floor(totalItems * 0.05), // 5% new this month
    total_count_monthly: Math.floor(totalItems * 0.15), // 15% total new this month
    total_data_count: totalItems,
  };
};

export interface ClientApiResponse {
  data: {
    clients: {
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
  mobile_client_count: number;
  web_client_count: number;
  mobile_monthly_count: number;
  web_monthly_count: number;
  total_count_monthly: number;
  total_data_count: number;
}

export const transformClientApiResponse = (
  response: ClientApiResponse
): ClientsPageData => {
  // console.log("res", response)
  const {
    data: { clients, pagination },
    mobile_client_count,
    web_client_count,
    mobile_monthly_count,
    web_monthly_count,
    total_count_monthly,
    total_data_count,
  } = response;
  return {
    total_clients: total_data_count,
    new_clients_this_month: total_count_monthly,
    mobile_clients: mobile_client_count,
    new_mobile_clients_this_month: mobile_monthly_count,
    web_clients: web_client_count,
    new_web_clients_this_month: web_monthly_count,
    total_pages: pagination.total_pages,
    current_page: pagination.current_page,
    clients: clients.map((client) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone_number: `${client?.phone?.profile_phone || ""}${client?.phone?.user_phone && client?.phone?.profile_phone
        ? " / " + client?.phone?.user_phone
        : ""
        }`,
      // phone_number: client.phone,
      user_tag: client.agent.toLowerCase() === "mobile" ? "mobile" : "web",
      picture_url: client?.picture,
      note: client?.note?.note !== null && client?.note?.note !== "",

      badge_color: client?.user_tier
        ? tierColorMap[client?.user_tier]
        : undefined,
    })),
  };
};

export interface ClientRequestParams {
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
