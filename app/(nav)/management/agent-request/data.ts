import { empty } from "@/app/config";
import api from "@/services/api";
import { formatNumber } from "@/utils/number-formatter";

export const formatDateRange = (startDate: string, endDate: string) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!startDate || !endDate) return "";
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export const formatDate = (dateString: string) => {
  if (!dateString) return "__,__,__";
  try {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  } catch {
    return "__,__,__";
  }
};

export const getPropertyRequests = (
  data: PropertyRequestDataType[]
): PropertyRequestDataType[] => {
  return (
    data.map((request: any) => ({
      requestId: request.propertyRequest.id,
      userName: request.user?.name || "--- ---",
      user: {
        role: request.user?.role || "--- ---",
        title: request.propertyRequest.title || "--- ---",
        tier: request.user.tier || "--- ---",
        professional_title: request.user.professional_title || "--- ---",
      },

      requestDate: formatDate(request.propertyRequest.created_at) || "--- ---",
      pictureSrc: request.user?.picture || empty,
      state: request.propertyRequest.state || "--- ---",
      lga: request.propertyRequest.lga || "--- ---",
      propertyType: request.propertyRequest.property_type || "--- ---",
      category: request.propertyRequest.property_category || "--- ---",
      subType: request.propertyRequest.sub_type || "--- ---",
      minBudget:
        `₦${formatNumber(request.propertyRequest.min_budget)}` || "--- ---",
      maxBudget:
        `₦${formatNumber(request.propertyRequest.max_budget)}` || "--- ---",
      requestType: "Web",
      description: request.propertyRequest.description || "--- ---",
      phoneNumber: request.user?.phone || "--- ---",
      propertyTitle: request.propertyRequest.title || "--- ---",
      userTitle: request.user?.title || "--- ---",
      targetAudience: request.propertyRequest.target_audience,
    })) || []
  );
};

export interface PropertyRequestDataType {
  userName: string;
  requestDate: string;
  pictureSrc: string;
  requestId: string;
  state: string;
  lga: string;
  user?: {
    professional_title: string;
    tier: string;
    role: string;
    title: string;
  };
  propertyType: string;
  description: string;
  phoneNumber: string;
  requestType: string;
  category: string;
  subType: string;
  minBudget: string;
  propertyTitle: string;
  maxBudget: string;
  userTitle: string;
  targetAudience: string[];
} // Check with backend if this is the correct data type

export const getPropertyRequestData = async () => {
  try {
    const response = await api.get("/property_request");
    return response.data;
  } catch (error) {
    console.error("Error fetching property request data:", error);
    throw error;
  }
};

// export const PropertyRequestData: PropertyRequestDataType[] = [
//   {
//     requestId: "1234567890",
//     userName: "Salam AIshat",
//     requestDate: "01/01/2024",
//     pictureSrc: "/empty/SampleLandlord.jpeg",
//     state: "Lagos",
//     lga: "Mushin",
//     propertyType: "Apartment",
//     category: "For Rent",
//     subType: "Block of Flats",
//     minBudget: "₦75,000,000",
//     maxBudget: "₦200,000,000",
//     requestType: "Web",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     phoneNumber: "08012345678",
//     propertyTitle: "Property Title",
//     userTitle: "Property Title",
//     targetAudience: [],
//   },
//   {
//     requestId: "1344567901",
//     userName: "Joe Wanu",
//     requestDate: "01/01/2024",
//     pictureSrc: "/empty/SampleLandlord.jpeg",
//     state: "Lagos",
//     lga: "Mushin",
//     subType: "Bungalow",
//     propertyType: "Duplex",
//     category: "For Sale",
//     requestType: "Mobile",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     phoneNumber: "08012345678",
//     minBudget: "₦75,000,000",
//     maxBudget: "₦200,000,000",
//     propertyTitle: "Property Title",
//     userTitle: "Property Title",
//     targetAudience: [],
//   },
//   {
//     requestId: "1344567901",
//     userName: "Joe Wanu",
//     requestDate: "01/01/2024",
//     pictureSrc: "/empty/SampleLandlord.jpeg",
//     state: "Lagos",
//     lga: "Mushin",
//     subType: "Bungalow",
//     propertyType: "Duplex",
//     category: "For Sale",
//     requestType: "Mobile",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     phoneNumber: "08012345678",
//     minBudget: "₦75,000,000",
//     maxBudget: "₦200,000,000",
//     propertyTitle: "Property Title",
//     userTitle: "Property Title",
//     targetAudience: [],
//   },
//   {
//     requestId: "1344567901",
//     userName: "Joe Wanu",
//     requestDate: "01/01/2024",
//     pictureSrc: "/empty/SampleLandlord.jpeg",
//     state: "Lagos",
//     lga: "Mushin",
//     subType: "Bungalow",
//     propertyType: "Duplex",
//     category: "For Sale",
//     requestType: "Mobile",
//     description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
//     phoneNumber: "08012345678",
//     minBudget: "₦75,000,000",
//     maxBudget: "₦200,000,000",
//     propertyTitle: "Property Title",
//     userTitle: "Property Title",
//     targetAudience: [],
//   },
// ];
