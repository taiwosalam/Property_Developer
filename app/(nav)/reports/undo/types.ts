import dayjs from "dayjs";
import { getLastSegment } from "../tracking/[userId]/types";

export interface TrashRecordsResponse {
  status: string;
  message: string;
  data: TrashRecord;
}

export interface TrashRecord {
  total_trash: number;
  total_this_month: number;
  trashes: {
    id: number;
    trashable_type: string;
    trashable_id: number;
    model: string;
    category: string;
    company_id: number;
    company_name: string;
    branch_id: number | null;
    branch_name: string | null;
    deleted_by: number;
    user_name: string;
    deleted_at: string;
    created_at: string;
    updated_at: string;
  }[]
}

export interface UndoTableData {
  total: number;
  this_month: number;
  table: {
    trashable_type: string;
    category: string;
    branch: string;
    deleted_by: string;
    date_deleted: string;
    time: string;
  }[];
}

const formatTextCell = (propertyName?: string | null): string => {
  return !propertyName || propertyName === "N/A" ? "__ __" : propertyName;
};

function getLastText(path: string) {
  return path.split("\\").pop();
}

export const transformUndoData = (data: TrashRecordsResponse) => {
  return {
    this_month: data?.data?.total_this_month,
    total: data?.data?.total_trash,
    table: data.data?.trashes?.map((record) => ({
      id: record?.id,
      trashable_type: getLastText(record.trashable_type) as string,
      category: record.category,
      branch: formatTextCell(record.branch_name),
      deleted_by: record.user_name,
      date_deleted: dayjs(record.deleted_at).format("DD/MM/YYYY"),
      time: dayjs(record.deleted_at).format("hh:mm A"),
    })),
  };
};
