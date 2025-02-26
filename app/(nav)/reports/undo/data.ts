import type { Field } from "@/components/Table/types";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

export const reportsUndoFilterOptionsWithDropdown = [
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

export const undoRequestTableFields: Field[] = [
  { id: "0", label: "S/N", accessor: "S/N" },
  { id: "1", label: "Event Deleted", accessor: "trashable_type" },
  {
    id: "2",
    label: "Category",
    accessor: "category",
  },
  { id: "3", label: "Branch", accessor: "branch" },
  {
    id: "5",
    label: "Deleted By",
    accessor: "deleted_by",
  },
  { id: "6", label: "Date Deleted", accessor: "date_deleted" },
  { id: "7", label: "Time", accessor: "time" },
  { id: "7", label: "", accessor: "action" },
];

export async function deleteUndoItem(id: string) {
  try {
    const data = await api.post(
      `report/trashes/permanent-delete?trash_id=${id}`
    );
    if (data.status === 200 || data.status === 201) {
      window.dispatchEvent(new Event("trashes"));
      toast.success("Item deleted permanently");
      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error, "Failed to delete item");
    return false;
  }
}

export async function restoreItem(id: string) {
  try {
    const payload = {
      trash_id: id
    }
    const data = await api.post(
      `report/trashes/restore`, payload
    );
    if (data.status === 200 || data.status === 201) {
      window.dispatchEvent(new Event("trashes"));
      toast.success("Item restored");
      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error, "Failed to delete item");
    return false;
  }
}
