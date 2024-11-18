// data.ts
import type { Field } from "@/components/Table/types";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

interface LandlordCardProps {
  id: string;
  name: string;
  email: string;
  user_tag: "mobile" | "web";
  phone_number: string | null;
  picture_url: string | null;
  badge_color: BadgeIconColors;
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

export interface LandlordPageState {
  gridView: boolean;
  landlordsPageData: LandlordsPageData;
}

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

const generateMockdata = (numItems: number): LandlordCardProps[] => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture_url: "/empty/SampleLandlord.jpeg",
    name: "Sample name",
    user_tag: index % 2 === 0 ? "mobile" : "web",
    email: `test${index + 1}@test.com`,
    phone_number: `08012345678`,
    badge_color: tierColorMap[index % Object.keys(tierColorMap).length],
  }));
};

export const mockData = generateMockdata(10);

// export const landlordFiltersWithDropdown = [
//   {
//     label: "Branch",
//     value: [
//       { label: "Branch 1", value: "branch1" },
//       { label: "Branch 2", value: "branch2" },
//       { label: "Branch 3", value: "branch3" },
//     ],
//   },
//   {
//     label: "Account Officer",
//     value: [
//       { label: "Account Officer 1", value: "account_officer1" },
//       { label: "Account Officer 2", value: "account_officer2" },
//       { label: "Account Officer 3", value: "account_officer3" },
//     ],
//   },
//   {
//     label: "State",
//     value: states.map((state) => ({
//       label: state,
//       value: state.toLowerCase(),
//     })),
//   },
// ];

export interface LandlordApiResponse {
  status: string;
  statusCode: number;
  data: {
    current_page: number;
    data: Array<{
      id: number;
      name: string;
      email: string;
      phone: string | null;
      tier_id: number;
      picture: string | null;
      agent: string;
    }>;
    last_page: number;
    total: number;
  };
  total_landlords: number;
  new_landlords_this_month: number;
  mobile_landlord_count: number;
  new_mobile_landlords_this_month: number;
  web_landlord_count: number;
  new_web_landlords_this_month: number;
  message: string;
}

export const transformLandlordApiResponse = (
  data: LandlordApiResponse
): LandlordsPageData => {
  return {
    total_landlords: data.total_landlords,
    new_landlords_this_month: data.new_landlords_this_month,
    mobile_landlords: data.mobile_landlord_count,
    new_mobile_landlords_this_month: data.new_mobile_landlords_this_month,
    web_landlords: data.web_landlord_count,
    new_web_landlords_this_month: data.new_web_landlords_this_month,
    total_pages: data.data.last_page,
    current_page: data.data.current_page,
    landlords: data.data.data.map((landlord) => ({
      id: String(landlord.id),
      name: landlord.name,
      email: landlord.email,
      phone_number: landlord.phone,
      user_tag: landlord.agent.toLowerCase() === "mobile" ? "mobile" : "web",
      picture_url: landlord.picture,
      badge_color: tierColorMap[landlord.tier_id] || "red",
    })),
  };
};
