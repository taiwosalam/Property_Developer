import type { FilterOptionMenu } from "@/components/Management/Landlord/types";
import api, { handleAxiosError } from "@/services/api";
import { MaintenanceApiResponse } from "./type";
import dayjs from "dayjs";

export const maintenanceFilterOptionsWithDropdown: FilterOptionMenu[] = [
  {
    radio: true,
    label: "Status",
    value: [
      { label: "all", value: "all" },
      { label: "Pending", value: "pending" },
      { label: "Ongoing", value: "in_progress" },
      { label: "Completed", value: "completed" },
    ],
  },
];

export const createMaintenance = async (
  data: FormData //change to formdata later
) => {
  try {
    const res = await api.post(`maintenance`, data);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchMaintenance"));
      return true;
    }
  } catch (error) {
    console.error(error);
    handleAxiosError(error);
    return false;
  }
};

export const getALLMaintenance = async () => {};

export const getMaintenanceById = async (id: string) => {};

interface UpdateMaintenanceData {
  start_date: Date;
  end_date: Date;
  cost: number;
  status: "not started" | "ongoing" | "completed" | "pending" | "in_progress";
}
export const updateMaintenance = async (
  id: number,
  data: UpdateMaintenanceData //change to formdata later
) => {
  const payload = {
    start_date: data?.start_date,
    end_date: data?.end_date,
    cost: data?.cost,
    status: data?.status,
  };
  try {
    const res = await api.patch(`maintenance/${id}`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchMaintenance"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    console.log(error);
  }
};

export const deleteMaintenance = async (id: number) => {
  try {
    const res = await api.delete(`maintenance/${id}`);
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("dispatchMaintenance"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

function getDayWithSuffix(day: number): string {
  if (day > 3 && day < 21) return `${day}TH`;
  const lastDigit = day % 10;
  switch (lastDigit) {
    case 1:
      return `${day}ST`;
    case 2:
      return `${day}ND`;
    case 3:
      return `${day}RD`;
    default:
      return `${day}TH`;
  }
}

function formatStartEndDate(start: string, end: string): string {
  const startDate = dayjs(start);
  const endDate = dayjs(end);

  const startDay = getDayWithSuffix(startDate.date());
  const endDay = getDayWithSuffix(endDate.date());
  const month = endDate.format("MMM").toUpperCase(); // e.g., "JAN"
  const year = endDate.format("YYYY");

  return `${startDay} - ${endDay} ${month} ${year}`;
}

export interface IMaintenanceCard {
  stats: {
    total: number;
    this_month: number;
  };
  data: {
    card: {
      maintenanceId: string;
      status:
        | "not started"
        | "ongoing"
        | "completed"
        | "pending"
        | "in_progress";
      propertyName: string;
      dateCreated: string;
      serviceProvider: string;
      startEndDate: string;
      priority: "high" | "critical" | "low" | "very low" | "medium";
      serviceType: string;
      viewOnly?: boolean;
    };
    modal: {
      maintenanceId: number;
      status:
        | "not started"
        | "ongoing"
        | "completed"
        | "pending"
        | "in_progress";
      property_name: string;
      branch_name: string;
      requested_by: string;
      maintenance_type: string;
      quotationFile?: string; 
      quotation_type: "text" | "file";
      created_at: string;
      priority: "high" | "critical" | "low" | "very low" | "medium";
      service_type: string;
      service_provider: string;
      work_details: string;
      quotation: string;
      start_date: string;
      end_date: string;
      cost: string;
      units: string;
    };
  }[];
  pagination: {
    current_page: number;
    total_pages: number;
  };
}
export const transformMaintenanceCard = (
  apiData: MaintenanceApiResponse
): IMaintenanceCard => {
  const { data } = apiData;
  return {
    stats: {
      total: apiData?.stats.total,
      this_month: apiData?.stats.this_month,
    },
    data: data?.data.map((item) => {
      return {
        card: {
          maintenanceId: item?.id.toString(),
          status:
            item?.status && item?.status === "pending"
              ? "not started"
              : item?.status === "in_progress"
              ? "ongoing"
              : "completed",
          propertyName: item?.property.title,
          dateCreated: item?.created_at
            ? dayjs(item?.created_at).format("DD/MM/YYYY")
            : "___ ___",
          serviceProvider: item?.provider?.company_name ?? "___ ___",
          startEndDate: formatStartEndDate(item?.start_date, item?.end_date),
          priority: item?.priority,
          serviceType: item?.provider?.service_render ?? "___ ___",
          viewOnly: false,
        },
        modal: {
          maintenanceId: item?.id,
          requested_by: item?.requested_by || "___ ___",
          branch_name: item?.branch.branch_name || "___ ___",
          maintenance_type: item?.maintenance_type || "___ ___",
          status:
            item?.status && item?.status === "pending"
              ? "not started"
              : item?.status === "in_progress"
              ? "ongoing"
              : "completed",
          units:
            item?.unit && item.unit.length > 0
              ? item.unit.join(",")
              : "___ ___",
          property_name: item?.property.title,
          created_at: item?.created_at
            ? dayjs(item?.created_at).format("DD/MM/YYYY")
            : "___ ___",
          priority: item?.priority,
          service_type: item?.provider?.service_render ?? "___ ___",
          service_provider: item?.service_provider,
          work_details: item?.detail,
          quotation: item?.quotation,
          quotation_type: item?.quotation_type,
          start_date: item?.start_date,
          end_date: item?.end_date,
          cost: item?.cost,
        },
      };
    }),
    pagination: {
      current_page: data?.current_page,
      total_pages: data?.last_page,
    }
  };
};

export interface MaintenanceRequestParams {
  page?: number;
  search?: string;
  sort_order?: "asc" | "desc";
  account_officer_id?: string;
  start_date?: string;
  end_date?: string;
  property_ids?: string;
  property_id?: string;
  branch_id?: string;
  status?: string;
  is_active?: string;
  branch_ids?: string;
}
