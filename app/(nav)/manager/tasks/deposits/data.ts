export const depositRequestOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export interface DepositRequestDataType {
  userName: string;
  requestDate: string;
  status: "pending" | "completed";
  pictureSrc: string;
  requestId: string;
  propertyName: string;
  state: string;
  unitDetails: string;
  amount: string;
  branch: string;
} // Check with backend if this is the correct data type

export const DepositRequestData: DepositRequestDataType[] = [
  {
    status: "pending",
    requestId: "1234567890",
    userName: "Salam AIshat",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Oyo",
    propertyName: "Property 1",
    unitDetails: "Unit 1",
    amount: "₦75,000,000",
    branch: "Bodija",
  },
  {
    status: "completed",
    requestId: "1234567890",
    userName: "Salam AIshat",
    requestDate: "01/01/2024",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    state: "Oyo",
    propertyName: "Property 2",
    unitDetails: "Unit 2",
    amount: "₦75,000,000",
    branch: "Bodija",
  },
];
