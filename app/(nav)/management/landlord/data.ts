// data.ts
import { LandlordProps } from "@/components/Management/Landlord/types";
import type { Field } from "@/components/Table/types";

export interface LandlordsPageData {
  total_landlords: number;
  new_landlords_this_month: number;
  mobile_landlords: number;
  new_mobile_landlords_this_month: number;
  web_landlords: number;
  new_web_landlords_this_month: number;
  landlords: LandlordProps[];
}

export interface LandlordPageState {
  gridView: boolean;
  total_pages: number;
  current_page: number;
  loading: boolean;
  error: Error | null;
  landlordsPageData: LandlordsPageData;
}

export const getAllLandlords = async (): Promise<LandlordsPageData | any> => {};

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
  })) as LandlordProps[];
};

export const mockData = generateMockdata(10);
