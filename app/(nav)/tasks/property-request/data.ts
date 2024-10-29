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
