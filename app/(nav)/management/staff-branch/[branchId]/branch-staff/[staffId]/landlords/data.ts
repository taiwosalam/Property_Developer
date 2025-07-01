import { empty } from "@/app/config";
import { StaffLandlordPageData } from "./types";
import { tierColorMap } from "@/components/BadgeIcon/badge-icon";

const generateMockdata = (numItems: number) => {
  const colors = ["red", "green", "black", "blue", "yellow", "gray"];
  return Array.from({ length: numItems }, (_, index) => ({
    id: `${index + 1}`,
    picture_url: "/empty/SampleLandlord.jpeg",
    name: `fuul name ${index + 1}`,
    user_tag: index % 2 === 0 ? "mobile" : "web",
    email: `test${index + 1}@test.com`,
    phone_number: `08012345678`,
    badge_color: colors[index % colors.length],
  })) as any[];
};

export const landlordMockData = generateMockdata(30);


export const transformStaffLandlordsApiResponse = (
  apiData: any
): StaffLandlordPageData => {
  const landlords = (apiData?.data?.landlords?.data || []).map((l: any) => ({
    id: String(l.id),
    picture_url: l.picture || empty,
    name: l.name,
    user_tag: l.user_tag || (l.email?.includes("mobile") ? "mobile" : "web"),
    email: l.email,
    phone_number: l.phone,
    note: "",
    badge_color: l.user_tier
      ? tierColorMap[l.user_tier as keyof typeof tierColorMap]
      : undefined,
  }));

  const pagination = {
    current_page: apiData?.data?.landlords?.pagination?.current_page || 1,
    total_page: apiData?.data?.landlords?.pagination?.total_pages || 1,
  };

  const staff = {
    name: apiData?.data?.name || "",
    role: apiData?.data?.position || "",
  };

  return { landlords, pagination, staff };
};
