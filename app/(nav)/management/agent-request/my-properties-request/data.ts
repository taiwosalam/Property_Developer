import { empty } from "@/app/config";
import { AgentCommunityRequestCardProps } from "@/components/tasks/CallBack/types";
import api from "@/services/api";
import { formatNumber } from "@/utils/number-formatter";
import dayjs from "dayjs";
import { PropertyRequestDataType } from "../data";

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
    target_audience: transformedData.target_audience
      ? typeof transformedData.target_audience === "string"
        ? transformedData.target_audience.split(",")
        : Array.isArray(transformedData.target_audience)
        ? transformedData.target_audience
        : [transformedData.target_audience]
      : [],
    min_budget: transformedData.min_budget?.toString() || "",
    max_budget: transformedData.max_budget?.toString() || "",
    valid_till: transformedData.valid_till || "",
  };

  try {
    const response = await api.post(
      "/agent-community/property-requests/create",
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
export const transformToCardProps = (data: any[]): PropertyRequestDataType[] =>
  data.map((request: any) => ({
    requestId: request.id,
    userName: request.user?.name || "--- ---",
    requestDate: dayjs(request.created_at).format("MMM DD YYYY") || "__,__,__",
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
    userTitle: request.user?.title || "--- ---",
    targetAudience: request.target_audience || [],
  })) || [];
