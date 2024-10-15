export const VisitorRequestFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export interface VisitorRequestDataDataType {
  userName: string;
  requestDate: string;
  requestId: string;
  status: "completed" | "pending" | "in-progress";
  pictureSrc: string;
  visitorName: string;
  visitorPhoneNumber: string;
  secretQuestion: string;
  secretAnswer: string;
  purpose: string;
  propertyName: string;
  branch: string;
} //check with API

export const VisitorRequestData: VisitorRequestDataDataType[] = [
  {
    userName: "Salam AIshat",
    requestDate: "01/01/2024",
    requestId: "56566346467",
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    visitorName: "John Doe",
    visitorPhoneNumber: "08012345678",
    secretQuestion: "What is the primary school?",
    secretAnswer: "Obalende secondary school.",
    purpose: "Attached",
    propertyName: "Sunset Villa",
    branch: "Akinleye",
  },
  {
    userName: "Jonah Jakpa",
    requestDate: "04/02/2024",
    requestId: "56566346467",
    status: "pending",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    visitorName: "John Doe",
    visitorPhoneNumber: "08012345678",
    secretQuestion: "What is the name of the first school?",
    secretAnswer: "Oke-Afa",
    purpose: "Attached",
    propertyName: "Sunset Villa",
    branch: "Akinleye",
  },
  {
    userName: "Ramsey Oke",
    requestDate: "05/03/2024",
    requestId: "56566346467",
    status: "in-progress",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    visitorName: "John Doe",
    visitorPhoneNumber: "08012345678",
    secretQuestion: "What is the name of the first school?",
    secretAnswer: "Oke-Afa",
    purpose: "Attached",
    propertyName: "Sunset Villa",
    branch: "Akinleye",
  },
];
