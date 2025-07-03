import dayjs from "dayjs";
import { ICautionApiResponse } from "./type";
import { formatToNaira } from "@/lib/utils";
import api, { handleAxiosError } from "@/services/api";

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
  tier_id?: number;
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

interface IDeposit {
  id: number;
  userName: string;
}
export interface ICautionPageData {
  total_request: number;
  total_request_month: number;
  total_completed: number;
  total_completed_month: number;
  total_pending: number;
  total_month_pending: number;
  deposit: DepositRequestDataType[];
  pagination: {
    total_page: number;
    current_page: number;
    last_page: number;
  };
}
export const transformCautionDeposit = (
  res: ICautionApiResponse
): ICautionPageData => {
  const { data } = res;

  return {
    total_request: data?.stats?.total_request,
    total_completed: data?.stats?.total_completed,
    total_completed_month: data?.stats?.total_month_completed,
    total_pending: data?.stats?.total_pending,
    total_request_month: data?.stats?.total_month_request,
    total_month_pending: data?.stats?.total_month_pending,
    deposit: data?.data?.map((d) => ({
      userName: d.user?.name?.toLowerCase(),
      requestDate: d.created_at
        ? dayjs(d.created_at).format("DD/MM/YYYY hh:mm A")
        : "--- ---",
      status: d.status,
      pictureSrc: d.user?.profile?.picture,
      tier_id: d.user?.tier_id,
      requestId: String(d.id),
      propertyName: d.property_name,
      state: d.state,
      unitDetails: d.caution_deposits_details || d.unit_name,
      amount: d.deposit_amount ? formatToNaira(d.deposit_amount) : "--- ---",
      branch: d.branch_name,
    })),
    pagination: {
      total_page: data?.pagination?.total,
      current_page: data?.pagination?.current_page,
      last_page: data?.pagination?.last_page,
    },
  };
};
export interface IDepositPayload {
  caution_deposits_details?: string[];
  refunded_amount: number;
  status?: string;
  request?: string;
}
export const handleCautionDeposit = async (
  depositId: string,
  data: IDepositPayload
) => {
  const payload = {
    caution_deposits_details: data?.caution_deposits_details,
    refunded_amount: data?.refunded_amount,
    status: data?.status,
    request_from: data?.request,
  };

  try {
    const res = await api.patch(
      `cautions-deposit/company/${depositId}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchDeposit"));
      return true;
    }
  } catch (error) {
    console.log(error);
    handleAxiosError(error);
    return false;
  }
};

export const depositChecklist = [
  "check inventory",
  "request for examine",
  "request for maintenance",
];
