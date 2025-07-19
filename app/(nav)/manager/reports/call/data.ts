import type { Field } from "@/components/Table/types";
import dayjs from "dayjs";

export const reportsCallsFilterOptionsWithDropdown = [
  {
    label: "Account Officer",
    value: [
      { label: "Account Officer 1", value: "account_officer1" },
      { label: "Account Officer 2", value: "account_officer2" },
      { label: "Account Officer 3", value: "account_officer3" },
    ],
  },
  {
    label: "Branch",
    value: [
      { label: "Branch 1", value: "Branch1" },
      { label: "Branch 2", value: "Branch2" },
      { label: "Branch 3", value: "Branch3" },
    ],
  },
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
];

export const callRequestTablefields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "id" },
  {
    id: "2",
    label: "Bracnh",
    accessor: "branch",
  },
  { id: "3", label: "Property", accessor: "property_name" },
  {
    id: "5",
    label: "Requester",
    accessor: "requester",
  },
  { id: "7", label: "Request Date & Time", accessor: "request_date_time" },
  { id: "7", label: "Resolve Date & Time", accessor: "resolve_date_time" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: "123456789",
    branch: "Akinyele Branch",
    property_name: "Property Name",
    requester: "Ajayi David",
    request_date_time: "12/02/2024 - 03:30am",
    resolve_date_time: "12/02/2024 - 03:30am",
  }));
};

export const CallRequestTableData = generateTableData(10);

export interface ICallbackRequest {
  id: number;
  branch: string;
  property_name: string;
  request_date_time: string;
  resolve_date_time: string;
  requester: string;
}
export interface ICallbackRequestPageData {
  total_callback: number;
  monthly_callback: number;
  total_resolved: number;
  monthly_resolved: number;
  total_unresolved: number;
  monthly_unresolved: number;
  callback_request: ICallbackRequest[];
}

export const transformCallbackPageData = (
  res: CallbackApiResponse
): ICallbackRequestPageData => {
  const { data } = res;
  return {
    total_callback: data?.total_CallRequests,
    monthly_callback: data?.monthly_CallRequests,
    total_resolved: data?.total_resolved,
    monthly_resolved: data?.monthly_resolved,
    total_unresolved: data?.total_unresolved,
    monthly_unresolved: data?.monthly_unresolved,
    callback_request: data?.CallRequests?.length
      ? data.CallRequests.map((item) => ({
          id: item?.call_back_id,
          requester: item?.requester?.toLowerCase(),
          branch: item?.branch_name,
          property_name: item?.property_name,
          request_date_time: item?.request_date_time
            ? dayjs(item?.request_date_time).format("DD-MM-YYYY HH:MM A")
            : "--- ---",
          resolve_date_time:
            item?.resolve_date_time === "N/A"
              ? "--- ---"
              : dayjs(item?.resolve_date_time).format("DD-MM-YYYY HH:MM A"),
        }))
      : [],
  };
};
