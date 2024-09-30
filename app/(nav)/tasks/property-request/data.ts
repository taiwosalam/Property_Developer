export interface PropertyRequestDataType {
  userName: string;
  requestDate: string;
  pictureSrc: string;
  requestId: string;
  state: string;
  lga: string;
  propertyType: string;
  category: string;
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
    propertyType: "Duplex",
    category: "Residential",
    minBudget: "₦75,000,000",
    maxBudget: "₦200,000,000",
  },
];
