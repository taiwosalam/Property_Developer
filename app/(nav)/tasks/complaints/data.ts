import dayjs from "dayjs";
import {
  ComplaintDetailResponse,
  ComplaintDetailsPageData,
  ComplaintsPageData,
  ComplaintsResponse,
} from "./types";
import api, { handleAxiosError } from "@/services/api";
import { BadgeIconColors } from "@/components/BadgeIcon/badge-icon";
import { getBadgeColor } from "@/lib/utils";

export const complaintsFilterOptionsWithDropdown = [
  {
    label: "Property",
    value: [
      { label: "Property 1", value: "Property1" },
      { label: "Property 2", value: "Property2" },
      { label: "Property 3", value: "Property3" },
    ],
  },
  {
    label: "Tenant/Occupant",
    value: [
      { label: "Tenant/Occupant 1", value: "Tenant/Occupant1" },
      { label: "Tenant/Occupant 2", value: "Tenant/Occupant2" },
      { label: "Tenant/Occupant 3", value: "Tenant/Occupant3" },
      { label: "Tenant/Occupant 4", value: "Tenant/Occupant4" },
      { label: "Tenant/Occupant 5", value: "Tenant/Occupant5" },
    ],
  },
];

export interface ComplaintsDashboard {
  complaints: {
    id: string;
    avatarSrc: string;
    name: string;
    badgeColor: BadgeIconColors;
    title: string;
    message: string;
  }[];
}
export const transformComplaintDashboard = (
  data: ComplaintsResponse
): ComplaintsDashboard => {
  return {
    complaints: data?.complaints
      .filter((recent) => recent.status.toLowerCase() === "pending")
      .map((complaint) => ({
        id: complaint.id.toString(),
        avatarSrc: complaint.picture,
        name: complaint.name,
        badgeColor: getBadgeColor(complaint?.tier_id) ?? "blue",
        title: complaint?.title,
        message: complaint?.description,
        time: complaint?.created_at
          ? dayjs(complaint.created_at).format("hh:mma")
          : "___ ___",
      })),
  };
};

export const transformComplaintsData = (
  data: ComplaintsResponse
): ComplaintsPageData => {
  return {
    total_complaints: data.total || 0,
    total_month_complaints: Number(data?.total_month) || 0,
    total_completed: Number(data?.total_completed) || 0,
    total_month_completed: Number(data?.total_month_completed) || 0,
    total_rejected: Number(data?.total_rejected) || 0,
    total_month_rejected: Number(data?.total_month_rejected) || 0,
    complaints: data?.complaints?.map((complaint) => ({
      id: complaint.id,
      columnId: complaint?.status?.toLowerCase(),
      content: {
        messageCount: 10,
        linkCount: 8,
        userAvatars:
          complaint?.comment_users.length > 0
            ? complaint?.comment_users?.map((image) => image.profile_picture)
            : [],
        date: complaint?.created_at
          ? dayjs(complaint?.created_at).format("DD MMMM YYYY")
          : "___ ___",
        status: complaint?.status.toLowerCase(),
        progress: complaint?.progress,
      },
      name: complaint?.name?.toLowerCase(),
      title: complaint?.title,
      message: complaint?.description,
      avatarSrc: complaint?.picture,
      tier: complaint?.tier_id,
    })),
    pagination: {
      total: data?.pagination.total,
      total_pages: data?.pagination?.total_pages,
      current_page: data?.pagination?.current_page,
      per_page: data?.pagination?.per_page,
    },
  };
};

export const transformComplaintDetails = (
  data: ComplaintDetailResponse
): ComplaintDetailsPageData => {
  return {
    id: data?.complaint?.id,
    senderName: data?.complaint.complaint_by,
    senderVerified: data?.complaint.tier ? true : false,
    complaintTitle: data?.complaint?.title,
    propertyName: data?.complaint?.property_title,
    unitName: data?.complaint?.unit_name,
    propertyAddress: `${data?.complaint?.property_address} ${data?.complaint?.property_lga} ${data?.complaint?.property_state}`,
    accountOfficer: data?.complaint?.account_officer ?? "___ ___",
    branch: data?.complaint?.branch_name,
    brief: data?.complaint?.brief,
    tier: data?.complaint?.tier,
  };
};

export interface IChangeComplainStatus {
  id: string;
  route: string;
}
export const approveAndProcessComplaint = async (
  note: string,
  details: IChangeComplainStatus
) => {
  const payload = {
    note,
  };
  try {
    const res = await api.post(
      `complaints/${details.id}/${details.route}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("refetchComplaints"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
  }
};

export const rejectComplaint = async (note: string, id: string) => {
  try {
    const res = await api.post(`complaints/${id}/reject?note=${note}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("refetchComplaints"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
  }
};
