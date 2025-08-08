import type { Field } from "@/components/Table/types";
import { VisitorRequestResponse } from "./types";
import dayjs from "dayjs";

export const reportsVisitorsFilterOptionsWithDropdown = [
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

export const visitorsRequestTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "ID", accessor: "request_id" },
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
  { id: "6", label: "Visitor", accessor: "visitor" },
  { id: "7", label: "Date", accessor: "date" },
  { id: "8", label: "Check In", accessor: "check_in" },
  { id: "9", label: "Check Out", accessor: "check_out" },
];

const generateTableData = (numItems: number) => {
  return Array.from({ length: numItems }, (_, index) => ({
    id: "123456789",
    branch: "Akinyele Branch",
    property_name: "Property Name",
    requester: "Ajayi David",
    visitor: "Ajayi David",
    date: "12/02/2024",
    check_in: "08:30am",
    check_out: "08:30am",
  }));
};

export const VisitorsRequestTableData = generateTableData(10);

export interface IVisitorsReportPageData {
  request_total: number;
  request_month: number;
  checked_in_total: number;
  checked_in_month: number;
  checked_out_total: number;
  checked_out_month: number;
  visitors: {
    id: number;
    request_id: string;
    branch: string;
    property_name: string;
    requester: string;
    date: string;
    check_in: string;
    check_out: string;
    pictureSrc: string | null;
    status: "completed" | "pending" | "in-progress" | "decline" | "checked_in" | "cancelled";
    userName: string;
    visitorName: string;
    visitorPhoneNumber: string;
    requestDate: string;
    secretQuestion: string;
    secretAnswer: string;
  }[];
  pagination: {
    total: number;
    current_page: number;
    last_page: number;
  }
}

export const transformVisitorsRequest = (
  res: VisitorRequestResponse
): IVisitorsReportPageData => {
  const { data } = res;
  return {
    request_total: data?.count?.total_requests,
    request_month: data?.count?.current_month_requests,
    checked_in_total: data?.count?.total_checked_in,
    checked_in_month: data?.count?.current_month_checked_in,
    checked_out_total: data?.count?.total_checked_out,
    checked_out_month: data?.count?.current_month_checked_out,
    visitors: data?.visitors?.data.map((req) => ({
      id: req.id,
      pictureSrc: req.picture,
      status: req.status,
      userName: req.userName,
      visitor: req.visitor_name,
      visitorName: req.visitor_name,
      visitorPhoneNumber: req.visitor_number,
      requestDate: req.request_date ? dayjs(req.request_date).format("DD/MM/YYYY") : "___ ___",
      secretQuestion: req.secret_question || "___ ___",
      secretAnswer: req.secret_answer,
      request_id: req.request_id,
      branch: req.branch_name || "___ ___",
      property_name: req.property_name || "___ ___",
      requester: req.visitor_name || "___ ___",
      date: req.request_date
        ? dayjs(req.request_date).format("DD/MM/YYYY")
        : "___ ___",
      check_in: req.check_in_time
        ? dayjs(req.check_in_time).format("hh:mmA")
        : "___ ___",
      check_out: req.check_out_time
        ? dayjs(req.check_out_time).format("hh:mmA")
        : "___ ___",
    })),
    pagination: {
      total: data?.visitors?.total,
      current_page: data?.visitors?.current_page,
      last_page: data?.visitors?.last_page,
    }
  };
};

