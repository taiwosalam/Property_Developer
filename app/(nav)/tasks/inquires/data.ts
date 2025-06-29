import dayjs from "dayjs";
import { CallRequestApiResponse } from "./type";
import api, { handleAxiosError } from "@/services/api";

export interface RequestCallBackCardDataType {
  id?: number;
  userName: string;
  requestDate: string;
  requestId: string;
  status: "completed" | "pending";
  pictureSrc: string;
  phoneNumber: string;
  propertyName: string;
  unitName?: string;
  propertyAddress: string;
  branch: string;
  accountOfficer: string;
  resolvedBy: string;
  resolvedDateTime: string;
  tier_id?: number;
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

export interface ICallRequestPageData {
  total_call: number;
  total_call_month: number;
  total_resolved_call: number;
  total_resolved_call_month: number;
  total_unresolved: number;
  total_unresolved_month: number;
  call_requests: RequestCallBackCardDataType[];
  pagination: {
    current_page: number;
    total: number;
  };
}
export const transformCallbackRequestPageData = (
  data: CallRequestApiResponse
): ICallRequestPageData => {
  return {
    total_call: data?.total_call,
    total_call_month: data?.total_call_month,
    total_resolved_call: data?.total_completed_call,
    total_resolved_call_month: data?.total_completed_call_month,
    total_unresolved: data?.total_pending_call,
    total_unresolved_month: data?.total_pending_call_month,
    call_requests: data?.data?.map((request) => {
      return {
        id: request?.id,
        requestId: request?.request_id.toString(),
        userName: request?.user?.name?.toLowerCase() || "___ ___",
        requestDate: request?.date,
        status: request?.status,
        pictureSrc: request?.user?.photo,
        phoneNumber: request?.user?.phone,
        propertyName: request?.property,
        propertyAddress: request?.property_address,
        branch: request?.branch,
        accountOfficer: request?.account_officer ?? "___ ___",
        resolvedBy: request?.resolved_by?.toLowerCase() ?? "___ ___",
        resolvedDateTime: request?.resolved_date || "___ ___",
        tier_id: request?.user?.tier,
      };
    }),
    pagination: {
      current_page: data?.pagination?.current_page,
      total: data?.pagination?.total_pages,
    },
  };
};

export const resolveCallRequest = async (id: number) => {
  try {
    const res = await api.put(`resolve-request/${id}`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchRequest"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    console.error(error);
    return false;
  }
};

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
