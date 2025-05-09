import type { Field } from "@/components/Table/types";
import dayjs from "dayjs";

export const reportsEmailFilterOptionsWithDropdown = [
  {
    label: "Tenant / Occupants",
    value: [
      { label: "Tenant 1", value: "tenant1" },
      { label: "Tenant 2", value: "tenant2" },
      { label: "Tenant 3", value: "tenant3" },
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
];

export const emailTablefields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "User ID", accessor: "user_id" },
  { id: "3", label: "Branch", accessor: "branch" },
  {
    id: "2",
    label: "Client Name",
    accessor: "client_name",
  },
  {
    id: "5",
    label: "Date",
    accessor: "date",
  },
  { id: "8", label: "Time", accessor: "time" },
];

export interface IEmail {
  id: number;
  user_id: number;
  client_name: string;
  subject: string;
  body: string;
  status: string;
  date: string;
  time: string;
  recipient: string;
  sender: string;
}
export interface IEmailReportResponse {
  status: string;
  message: string;
  data: {
    emails: IEmail[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}

export interface EmailPageData {
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
  };
  emails: {
    user_id: number;
    branch: string;
    client_name: string;
    date: string;
    time: string;
  }[];
}

export const transformEmailReport = (
  data: IEmailReportResponse
): EmailPageData => {
  return {
    pagination: {
      total: data.data.pagination.total || 0,
      current_page: data.data.pagination.current_page || 0,
      last_page: data.data.pagination.last_page || 0,
    },
    emails: data?.data?.emails?.map((email) => ({
      user_id: email?.user_id,
      branch: email?.subject || "___ ___",
      client_name: email?.client_name || "",
      date: email?.date || "___ ___",
      time: email?.time
        ? dayjs(email.time, "HH:mm").format("hh:mm A")
        : "___ ___",
    })),
  };
};
