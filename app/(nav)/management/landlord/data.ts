// data.ts
import { LandlordProps } from "@/components/Management/Landlord/types";
import { Field } from "@/components/Table/table";

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

export const getAllLandlords = async (
  access_token: string | null
): Promise<LandlordsPageData> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/landlords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching landlords:", error);
    throw new Error(`Error: ${error}`);
  }
};

export const getOneLandlord = async (
  landlordId: string,
  access_token: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/landlords/${landlordId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching landlord", error);
  }
};

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
      textOverflow: "ellipsis",
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
