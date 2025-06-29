export interface RequestCallBackCardDataType {
  userName: string;
  requestDate: string;
  requestId: string;
  status: "completed" | "pending";
  pictureSrc: string;
  phoneNumber: string;
  propertyName: string;
  propertyAddress: string;
  branch: string;
  accountOfficer: string;
  resolvedBy: string;
  resolvedDateTime: string;
  unitName?: string;
} //check with API

export const inquiriesFilterOptionsWithDropdown = [
  {
    label: "Properties",
    value: [
      {
        label: "Property 1",
        value: "1",
      },
      {
        label: "Property 2",
        value: "2",
      },
      {
        label: "Property 3",
        value: "3",
      },
    ],
  },
];

export const RequestCallBackCardData: RequestCallBackCardDataType[] = [
  {
    userName: "Salam AIshat",
    requestDate: "12/01/2024",
    requestId: "56566346467",
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    phoneNumber: "08012345678",
    propertyName: "Sunset Villa",
    propertyAddress: "123 Main St",
    branch: "Main Branch",
    accountOfficer: "John Doe",
    resolvedBy: "Jane Doe",
    resolvedDateTime: "12/02/2024 10:00 AM",
  },
  {
    userName: "Alice Johnson",
    requestDate: "2023-10-01",
    requestId: "REQ123456",
    status: "pending",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    phoneNumber: "08098765432",
    propertyName: "Ocean View",
    propertyAddress: "456 Ocean Ave",
    branch: "Downtown Branch",
    accountOfficer: "Jane Smith",
    resolvedBy: "Ajala David",
    resolvedDateTime: "12/12/12 - (12:00pm)",
  },
  {
    userName: "Charlie Davis",
    requestDate: "2023-09-15",
    requestId: "REQ654321",
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    phoneNumber: "08011223344",
    propertyName: "Mountain Retreat",
    propertyAddress: "789 Mountain Rd",
    branch: "Uptown Branch",
    accountOfficer: "Bob Brown",
    resolvedBy: "Alice Brown",
    resolvedDateTime: "2023-09-16 11:00 AM",
  },
  {
    userName: "David Smith",
    requestDate: "2023-11-20",
    requestId: "REQ789012",
    status: "pending",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    phoneNumber: "08022334455",
    propertyName: "Lakeside Cottage",
    propertyAddress: "101 Lakeview Dr",
    branch: "Eastside Branch",
    accountOfficer: "Alice Green",
    resolvedBy: "Alice Brown",
    resolvedDateTime: "2023-09-16 11:00 AM",
  },
  {
    userName: "Eve Black",
    requestDate: "2023-12-05",
    requestId: "REQ345678",
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    phoneNumber: "08033445566",
    propertyName: "Forest Cabin",
    propertyAddress: "202 Forest Ln",
    branch: "Westside Branch",
    accountOfficer: "Chris White",
    resolvedBy: "Alice Brown",
    resolvedDateTime: "2023-09-16 11:00 AM",
  },
  {
    userName: "Frank White",
    requestDate: "2023-08-30",
    requestId: "REQ901234",
    status: "completed",
    pictureSrc: "/empty/SampleLandlord.jpeg",
    phoneNumber: "08044556677",
    propertyName: "City Apartment",
    propertyAddress: "303 City St",
    branch: "Northside Branch",
    accountOfficer: "David Blue",
    resolvedBy: "Eve Green",
    resolvedDateTime: "2023-09-01 09:00 AM",
  },
];

export const getAllCallbackRequests = async () => {};
