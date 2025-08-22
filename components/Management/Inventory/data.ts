// Types
import api from "@/services/api";
import type { InventoryCardDataProps } from "./types";

// export const inventory_data_props: InventoryCardDataProps = {
//   inventory_id: "",
//   created_date: "",
//   edited_date: "",
//   property_name: "",
//   branch_name: "",
//   account_officer: "",
// };

export const inventory_conditions = ["new", "good", "fair", "bad"];

export const getBranch = async (branch_id: string) => {
  const branch = await api.get(`/branch/${branch_id}`);
  return branch;
};

export interface InventoryApiData {
  total_pages: number;
  total_inventory: number;
  new_inventory_this_month: number;
  data: {
    data: InventoryCardDataProps[];
  };
}

export interface InventoryPageData {
  total_inventory: number;
  total_pages: number;
  current_page: number;
  data: {
    data: InventoryCardDataProps[];
  };
}

export interface InventoryPageState {
  gridView: boolean;
  inventoryPageData: InventoryPageData;
}