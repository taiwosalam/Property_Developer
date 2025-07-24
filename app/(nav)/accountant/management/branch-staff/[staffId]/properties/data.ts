import { empty } from "@/app/config";
import {
  ResStaffProperty,
  StaffPropertiesApiResponse,
  StaffPropertyPageData,
} from "./types";
import { Currency } from "@/utils/number-formatter";

export const staffPropertyMockData: StaffPropertyPageData = {
  properties: [
    {
      address: "123 Main St",
      isClickable: true,
      id: "1",
      images: [empty],
      property_name: "Property 1",
      total_units: 1,
      total_returns: 1000,
      total_income: 1000,
      total_unit_pictures: 8,
      hasVideo: true,
      property_type: "rental",
      currency: "naira",
    },
    {
      address: "123 Main St",
      isClickable: true,
      id: "1",
      images: [empty],
      property_name: "Property 1",
      total_units: 1,
      total_returns: 1000,
      total_income: 1000,
      total_unit_pictures: 8,
      hasVideo: true,
      property_type: "rental",
      currency: "naira",
    },
  ],
  pagination: {
    current_page: 1,
    total_page: 1,
  },
  staff: {
    name: "Mubarak Abdulrafiu",
    role: "branch manager",
  },
};

const mapApiPropertyToDisplay = (property: ResStaffProperty) => {
  const total_returns = property.unit
    ? property.unit.reduce((sum, unit) => sum + parseFloat(unit.fee_amount), 0)
    : 0;
  const feePercentage =
    property.property_type === "rental"
      ? property.agency_fee
      : property.management_fee;

  return {
    address: property.full_address || "",
    isClickable: true,
    id: String(property.id),
    images:
      property.images && property.images.length
        ? property.images.map((img) => img.path)
        : [empty],
    property_name: property.name || "",
    total_units: property.total_unit ?? 0,
    total_returns,
    total_income: (total_returns * feePercentage) / 100,
    total_unit_pictures: property.images?.length || 0,
    hasVideo: false, // Set this if you support it
    property_type: property.property_type || "",
    currency: property.currency || "naira" as Currency,
  };
};

export const transformStaffPropertiesApiResponse = (
  apiData: StaffPropertiesApiResponse
): StaffPropertyPageData => {
  const props = apiData?.data?.properties?.data || [];
  const properties = props.map(mapApiPropertyToDisplay);

  const pagination = {
    current_page: apiData?.data?.properties?.pagination?.current_page || 1,
    total_page: apiData?.data?.properties?.pagination?.total_pages || 1,
  };

  const staff = {
    name: apiData?.data?.name || "",
    role: apiData?.data?.position || "",
  };

  return {
    properties,
    pagination,
    staff,
  };
};
