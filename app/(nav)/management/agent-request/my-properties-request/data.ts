import { empty } from "@/app/config";
import { AgentCommunityRequestCardProps } from "@/components/tasks/CallBack/types";
import api from "@/services/api";
import { formatNumber } from "@/utils/number-formatter";
import dayjs from "dayjs";
import { PropertyRequestDataType } from "../data";
import { parseCurrency } from "@/app/(nav)/accounting/expenses/[expenseId]/manage-expenses/data";

export const transformFormData = (
  formData: FormData,
  keyMap: Record<string, string> = {}
): Record<string, any> => {
  const transformedData: Record<string, any> = {};

  Array.from(formData.entries()).forEach(([key, value]) => {
    console.log("Processing key:", key);
    console.log("KeyMap contains key?", key in keyMap);

    const mappedKey = keyMap[key] || key;
    transformedData[mappedKey] = value;
  });
  return transformedData;
};

export const createPropertyRequest = async (
  data: FormData | Record<string, any>
) => {
  const keyMapping: Record<string, string> = {
    content: "description",
    propertyCategory: "property_category",
    propertyType: "property_type",
    propertySubType: "property_sub_type",
    targetAudience: "target_audience",
    minBudget: "min_budget",
    maxBudget: "max_budget",
    validTill: "valid_till",
    state: "state",
    lga: "lga",
  };

  const transformedData =
    data instanceof FormData
      ? transformFormData(data, keyMapping)
      : Object.fromEntries(
          Object.entries(data).map(([key, value]) => [
            keyMapping[key] || key,
            value,
          ])
        );

  // Format the data to match the required structure
  const formattedData = {
    title: transformedData.title || "",
    description: transformedData.description || "",
    property_category: transformedData.property_category || "",
    property_type: transformedData.property_type || "",
    property_sub_type: transformedData.property_sub_type || "",
    // target_audience: transformedData.target_audience
    //   ? typeof transformedData.target_audience === "string"
    //     ? transformedData.target_audience.split(",")
    //     : Array.isArray(transformedData.target_audience)
    //     ? transformedData.target_audience
    //     : [transformedData.target_audience]
    //   : [],
    state: transformedData.state || "",
    lga: transformedData.lga || "",
    min_budget: parseCurrency(transformedData.min_budget),
    max_budget: parseCurrency(transformedData.max_budget),
    valid_till: transformedData.valid_till || "",
  };

  try {
    const response = await api.post(
      // "/agent-community/property-requests/create",
      "/agent_requests",
      formattedData
    );
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error creating property request:", error);
    throw error;
  }
};

// DONE WITH CREATEPROPERTYREQUEST

// Transform raw API data directly into card props
export const transformToCardProps = (
  data: any[]
): PropertyRequestDataType[] => {
  const transformed =
    data.map((request: any) => {
      const cardProps = {
        requestId: request.id,
        userName: `${request?.user?.title || ""} ${
          request.user?.name || "--- ---"
        }`,
        requestDate:
          dayjs(request.created_at).format("MMM DD YYYY") || "__,__,__",
        pictureSrc: request.user?.profile?.picture || empty,
        state: request.state || "--- ---",
        lga: request.lga || "--- ---",
        propertyType: request.property_type || "--- ---",
        category: request.property_category || "--- ---",
        subType: request.sub_type || "--- ---",
        minBudget: `₦${formatNumber(request.min_budget)}` || "--- ---",
        maxBudget: `₦${formatNumber(request.max_budget)}` || "--- ---",
        requestType: "Web",
        description: request.description || "--- ---",
        phoneNumber: request.user?.phone || "--- ---",
        propertyTitle: request.title || "--- ---",
        userTitle: request.user?.professional_title || "--- ---",
        targetAudience: request.target_audience || [],
        expiredDate:
          dayjs(request.end_date).format("MMM DD YYYY") || "__,__,__",
      };
      return cardProps;
    }) || [];
  return transformed;
};

export interface ApiPropertyRequest {
  id: number;
  slug: string;
  title: string;
  published: number; // 0 or 1
  professional_title: string;
  description: string;
  property_category: string;
  property_type: string;
  property_sub_type: string | null;
  state: string;
  lga: string;
  agent: string;
  min_budget: string;
  max_budget: string;
  start_date: string;
  end_date: string;
  created_at: string;
  share_link: string;
}

export interface ApiUser {
  id: number;
  name: string;
  phone: string;
  picture: string;
  profile_title: string;
  title: string;
  professional_title: string;
  tier: string;
  company_is_verified: string | null;
  company_status: string | null;
}

export interface ApiDataItem {
  propertyRequest: ApiPropertyRequest;
  user: ApiUser;
}

export const transformToAgentCommunityCardProps: (
  apiData: ApiDataItem[]
) => AgentCommunityRequestCardProps[] = (
  apiData: ApiDataItem[]
): AgentCommunityRequestCardProps[] => {
  return apiData.map(({ propertyRequest, user }) => ({
    cardType: "agent-community",
    userName: `${user?.title || ""} ${user?.name || "--- ---"}`,
    userTitle: user.professional_title,
    pictureSrc: user.picture,
    // requestId: propertyRequest.slug,
    requestId: propertyRequest.id.toString(),
    propertyTitle: propertyRequest.title,
    requestDate: propertyRequest.created_at,
    lga: propertyRequest.lga,
    state: propertyRequest.state,
    requestType: "Web",
    subType: propertyRequest.property_sub_type || "--- ---",
    phoneNumber: user?.phone || "--- ---",
    propertyType: propertyRequest.property_type,
    category: propertyRequest.property_category,
    minBudget: `₦${formatNumber(parseFloat(propertyRequest.min_budget))}`,
    maxBudget: `₦${formatNumber(parseFloat(propertyRequest.max_budget))}`,
    expiredDate: dayjs(propertyRequest.end_date).format("MMM DD YYYY"),
    // targetAudience: propertyRequest.professional_title,
    cardViewDetails: [
      { label: "Location(state)", accessor: "state" },
      { label: "Local Government", accessor: "lga" },
      { label: "Property Type", accessor: "propertyType" },
      { label: "Expired Date", accessor: "expiredDate" },
      { label: "Min Budget", accessor: "minBudget" },
      { label: "Max Budget", accessor: "maxBudget" },
    ],
    published: propertyRequest.published === 1,
    description: propertyRequest.description,
    status: propertyRequest.published ? "active" : "inactive",
    shareLink: propertyRequest.share_link,
  }));
};
