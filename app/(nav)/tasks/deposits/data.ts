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
  userId?: number;
  tier_id?: number;
  requestDate: string;
  status: "pending" | "completed" | "progress";
  pictureSrc: string;
  requestId: string;
  propertyName: string;
  accountOfficer?: string;
  state: string;
  unitDetails: string;
  amount: string;
  branch: string;
  request_from?: string;
  is_inventory?: boolean;
  is_examine?: boolean;
  is_maintain?: boolean;
  inventory_at?: string | null;
  examined_at?: string | null;
  maintain_at?: string | null;
  rejected_at?: string | null;
  inventory_by?: string | null;
  examine_by?: string | null;
  maintain_by?: string | null;
  created_at?: string | null;
  refunded_amount?: string | null;
  resolved_by?: string | null;
  resolved_date?: string | null;
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
      status:
        d.status && d.status?.toLowerCase() === "approved"
          ? "completed"
          : d.status,
      pictureSrc: d.user?.picture,
      accountOfficer: d.accountOfficer || "--- ---",
      tier_id: d.user?.tier_id,
      requestId: String(d.id),
      propertyName: d.property_name,
      state: d.state,
      userId: d.user?.id,
      unitDetails: d.caution_deposits_details || d.unit_name,
      amount: d.deposit_amount ? formatToNaira(d.deposit_amount) : "--- ---",
      branch: d.branch_name,
      is_inventory: d.is_inventory,
      request_from: d.request_from?.toLowerCase(),
      is_examine: d.is_examine,
      is_maintain: d.is_maintain,
      maintain_at: d.maintain_at,
      inventory_at: d.inventory_at,
      examined_at: d.examined_at,
      rejected_at: d.rejected_at,
      inventory_by: d.inventory_by,
      examine_by: d.examine_by,
      maintain_by: d.maintain_by,
      created_at: d.created_at,
      refunded_amount: d.refunded_amount
        ? formatToNaira(d.refunded_amount)
        : "--- ---",
      resolved_by: d.maintain_by,
      resolved_date: d.created_at
        ? dayjs(d.updated_at).format("DD/MM/YYYY hh:mm A")
        : "--- ---",
    })),
    pagination: {
      total_page: data?.pagination?.total,
      current_page: data?.pagination?.current_page,
      last_page: data?.pagination?.last_page,
    },
  };
};
export interface IDepositPayload {
  refunded_amount?: number;
  status?: string;
  is_inventory?: boolean;
  is_examine?: boolean;
  is_maintain?: boolean;
}
export const updateCautionDeposit = async (
  depositId: string,
  data: IDepositPayload
) => {
  const payload = {
    refunded_amount: data?.refunded_amount,
    status: data?.status,
    is_examine: data?.is_examine,
    is_maintain: data?.is_maintain,
    is_inventory: data?.is_inventory,
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
      //window.dispatchEvent(new Event("dispatchDeposit"));
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
