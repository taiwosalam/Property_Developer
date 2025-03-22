import { empty } from "@/app/config";
import api from "@/services/api";

export const calculateYearsInIndustry = (dateString: string) => {
  if (!dateString) return null;
  const registrationDate = new Date(dateString);
  const today = new Date();
  const years = today.getFullYear() - registrationDate.getFullYear();
  return `${years}+ years`;
};
export const getThreads = async () => {
  try {
    const response = await api.get("/agent_community");
    return response.data;
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const getThreadById = async (id: string) => {
  try {
    const response = await api.get(`/agent_community/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching thread:", error);
    throw error;
  }
};

export const getLoggedInUserThreads = async () => {
  try {
    const response = await api.get("/agent_community/user/posts");
    return response.data;
  } catch (error) {
    console.error("Error fetching threads:", error);
    throw error;
  }
};

export const getAllPropertyRequests = async () => {
  try {
    const response = await api.get("/agent-community/property-requests/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching property requests:", error);
    throw error;
  }
};

export const getLoggedInUserPropertyRequests = async () => {
  try {
    const response = await api.get("/agent-community/property-requests/user");
    return response.data;
  } catch (error) {
    console.error("Error fetching property requests:", error);
    throw error;
  }
};

export const updatePropertyRequest = async (id: string, data: any) => {
  const keyMapping: Record<string, string> = {
    title: "title",
    content: "description",
    property_category: "property_category",
    property_type: "property_type",
    property_sub_type: "property_sub_type",
    target_audience: "target_audience",
    min_budget: "min_budget",
    max_budget: "max_budget",
    valid_till: "valid_till",
  };

  const formattedData = {
    title: data.title || "",
    description: data.content || "",
    property_category: data.property_category || "",
    property_type: data.property_type || "",
    property_sub_type: data.property_sub_type || "",
    target_audience: data.target_audience
      ? typeof data.target_audience === "string"
        ? [data.target_audience]
        : Array.isArray(data.target_audience)
        ? data.target_audience
        : [data.target_audience]
      : [],
    min_budget: data.min_budget?.toString() || "",
    max_budget: data.max_budget?.toString() || "",
    valid_till: data.valid_till || "",
    _method: "patch",
  };

  console.log("formattedData", formattedData);
  try {
    const response = await api.post(
      `/agent-community/property-requests/${id}`,
      formattedData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating property request:", error);
    throw error;
  }
};

export const deletePropertyRequest = async (id: string) => {
  try {
    await api.delete(`/agent-community/property-requests/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting property request:", error);
    return false;
  }
};
