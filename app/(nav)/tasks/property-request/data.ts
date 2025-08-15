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
  location?: string;
  createdAt?: string;
  updatedAt?: string;
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
    tier_id: number;
    requestDate: string;
    pictureSrc: string;
    requestId: string;
    state: string;
    lga: string;
    location: string;
    propertyType: string;
    description: string;
    phoneNumber: string;
    requestType: string;
    category: string;
    subType: string;
    minBudget: string;
    maxBudget: string;
    createdAt: string;
    updatedAt: string;
  }[];
  pagination: {
    total_pages: number;
    current_page: number;
  };
}

const randomAvatar = [
  "https://pubassets.ourproperty.ng/uploads/gBTaZYUXOch2qrKq5k5F2EdShRihQjYGuxDwOuu6.png",
  "https://pubassets.ourproperty.ng/uploads/7M10IKK6OGULqivpfmJ7AMYWNb1BAzpboSLtHffM.png",
  "https://pubassets.ourproperty.ng/uploads/es2Oy2BoX9CmUjhJMfXS2ILNRkrelzY8aGIKddz1.png",
  "https://pubassets.ourproperty.ng/uploads/yZlXfgqcoIV4SSDpvTrbV2M5udRiusWXunoiC9hz.png",
  "https://pubassets.ourproperty.ng/uploads/UeHG28utJmv673FdhAMkwQT1Iqsw1wQgcfudaBbj.png",
  "https://pubassets.ourproperty.ng/uploads/wY5EG56esonczs2vmo9nViwPOC9h0t8cFdR7IEKO.png",
  "https://pubassets.ourproperty.ng/uploads/ZR5yx0996Xg0hKpEvf3LEtHenF7TKcMrR0pID0RH.png",
  "https://pubassets.ourproperty.ng/uploads/gkPOBmMBZi1c8Lp9VCbiEf7PuGDAj0c5r0JUmFww.png",
  "https://pubassets.ourproperty.ng/uploads/WVaRTdl51SieJHw1sp6wu9h81Hu7F6NVa3wlkDZH.png",
  "https://pubassets.ourproperty.ng/uploads/gkPOBmMBZi1c8Lp9VCbiEf7PuGDAj0c5r0JUmFww.png",
];

const getRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * randomAvatar.length);
  return randomAvatar[randomIndex];
};

export const transformPropertyRequestData = (
  data: PropertyRequestApi
): propertyRequestPageData => {
  return {
    total: data?.total_requests_overall,
    total_month: data?.total_requests_this_month,

    requests: data.data.map((request) => ({
      userId: request?.user_id,
      tier_id: request?.tier,
      userName: request.name?.toLowerCase(),
      requestDate: request?.created_at
        ? dayjs(request.created_at).format("DD/MM/YYYY")
        : "",
      pictureSrc: request?.user_id ? request?.image ?? "" : getRandomAvatar(),
      requestId: request.id.toString(),
      state: request?.state || "--- ---",
      lga: request?.lga || "--- ---",
      location: request?.location || "--- ---",
      propertyType: request?.property_type,
      description: request?.description,
      phoneNumber: request?.phone,
      requestType: request?.request_type,
      category: request?.category,
      subType: request?.property_sub_type,
      createdAt: request?.created_at
        ? dayjs(request?.created_at).format("DD/MM/YYYY")
        : "--- ---",
      updatedAt: request?.updated_at
        ? dayjs(request?.updated_at).format("DD/MM/YYYY")
        : "--- ---",
      minBudget: formatToNaira(request?.budget_min),
      maxBudget: formatToNaira(request?.budget_max),
    })),
    pagination: {
      total_pages: data?.pagination?.total_pages,
      current_page: data?.pagination?.current_page,
    },
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
    location: "Lagos",
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
