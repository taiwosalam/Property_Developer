// data.ts
import { LandlordProps } from "@/components/Management/Landlord/types";

export const defaultLandlordPageData: LandlordsPageData = {
  total_landlords: 0,
  new_landlords_this_month: 0,
  mobile_landlords: 0,
  new_mobile_landlords_this_month: 0,
  web_landlords: 0,
  new_web_landlords_this_month: 0,
  landlords: [],
};

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

export const getAllLandlords = async (): Promise<LandlordsPageData> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/landlords`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${"347|JRkC0VQXb5qSbfRaBbrxaJrFHSt8XBfOzARuRAvj1c16ae78"}`,
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

export const getOneLandlord = async (landlordId: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/landlords/${landlordId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${"347|JRkC0VQXb5qSbfRaBbrxaJrFHSt8XBfOzARuRAvj1c16ae78"}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching landlord:", error);
    throw new Error(`Error: ${error}`);
  }
};
