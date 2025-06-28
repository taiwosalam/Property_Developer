import dayjs from "dayjs";
import { PropertyRequestApi } from "./type";
import { formatToNaira } from "@/lib/utils";

export interface PropertyRequestDataType {
  userName: string;
  requestDate: string;
  pictureSrc: string;
  requestId: string;
  state: string;
  lga: string;
  propertyType: string;
  description: string;
  phoneNumber: string;
  requestType: string;
  category: string;
  subType: string;
  minBudget: string;
  maxBudget: string;
} // Check with backend if this is the correct data type

export interface propertyRequestPageData {
  total: number;
  total_month: number;
  requests: {
    userId: number;
    userName: string;
    requestDate: string;
    pictureSrc: string;
    requestId: string;
    state: string;
    lga: string;
    propertyType: string;
    description: string;
    phoneNumber: string;
    requestType: string;
    category: string;
    subType: string;
    minBudget: string;
    maxBudget: string;
  }[];
}

export const transformPropertyRequestData = (
  data: PropertyRequestApi
): propertyRequestPageData => {
  return {
    total: data?.total_requests_overall,
    total_month: data?.total_requests_this_month,

    requests: data.data.map((request) => ({
      userId: request?.user_id,
      userName: request.name?.toLowerCase(),
      requestDate: request?.created_at
        ? dayjs(request.created_at).format("DD/MM/YYYY")
        : "",
      pictureSrc: request?.image ?? "",
      requestId: request.id.toString(),
      state: request?.state,
      lga: request?.lga,
      propertyType: request?.property_type,
      description: request?.description,
      phoneNumber: request?.phone,
      requestType: request?.property_type,
      category: request?.category,
      subType: request?.property_sub_type,
      minBudget: formatToNaira(request?.budget_min),
      maxBudget: formatToNaira(request?.budget_max),
    })),
  };
};

export const PropertyRequestData: PropertyRequestDataType[] = [
  {
    requestId: "1234567890",
    userName: "Salam AIshat",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Lagos",
    lga: "Mushin",
    propertyType: "Apartment",
    category: "For Rent",
    subType: "Block of Flats",
    minBudget: "₦75,000,000",
    maxBudget: "₦200,000,000",
    requestType: "Web",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phoneNumber: "08012345678",
  },
  {
    requestId: "1344567901",
    userName: "Joe Wanu",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Lagos",
    lga: "Mushin",
    subType: "Bungalow",
    propertyType: "Duplex",
    category: "For Sale",
    requestType: "Mobile",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phoneNumber: "08012345678",
    minBudget: "₦75,000,000",
    maxBudget: "₦200,000,000",
  },
  {
    requestId: "1344567901",
    userName: "Joe Wanu",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Lagos",
    lga: "Mushin",
    subType: "Bungalow",
    propertyType: "Duplex",
    category: "For Sale",
    requestType: "Mobile",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phoneNumber: "08012345678",
    minBudget: "₦75,000,000",
    maxBudget: "₦200,000,000",
  },
  {
    requestId: "1344567901",
    userName: "Joe Wanu",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Lagos",
    lga: "Mushin",
    subType: "Bungalow",
    propertyType: "Duplex",
    category: "For Sale",
    requestType: "Mobile",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phoneNumber: "08012345678",
    minBudget: "₦75,000,000",
    maxBudget: "₦200,000,000",
  },
  {
    requestId: "1344567901",
    userName: "Joe Wanu",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Lagos",
    lga: "Mushin",
    subType: "Bungalow",
    propertyType: "Duplex",
    category: "For Sale",
    requestType: "Mobile",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phoneNumber: "08012345678",
    minBudget: "₦75,000,000",
    maxBudget: "₦200,000,000",
  },
  {
    requestId: "1344567901",
    userName: "Joe Wanu",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Lagos",
    lga: "Mushin",
    subType: "Bungalow",
    propertyType: "Duplex",
    category: "For Sale",
    requestType: "Mobile",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    phoneNumber: "08012345678",
    minBudget: "₦75,000,000",
    maxBudget: "₦200,000,000",
  },
];
