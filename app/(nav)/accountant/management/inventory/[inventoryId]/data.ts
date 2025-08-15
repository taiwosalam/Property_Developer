// data.ts
import { transformUnitDetails } from "@/app/(nav)/listing/data";
import {
  InventoryApiResponse,
  InventoryUnitPageData,
  InventoryData,
  InventoryUnitData,
} from "./types";

export const transformInventoryUnitApiResponse = (
  apiData: InventoryApiResponse
): InventoryUnitPageData => {
  const { inventory, unit, pagination } = apiData;

  // Transform inventory data for InventoryListInfo
  const inventoryData: InventoryData = {
    title: inventory?.title || "--- ---",
    inventory_id: inventory?.id?.toString() || "0",
    created_date: inventory?.created_date || "__,__,__",
    edited_date: inventory?.edited_date || "__,__,__",
    property_name: inventory?.property_name || "--- ---",
    branch_name: inventory?.branch_name || "--- ---",
    account_manager: inventory?.account_officer?.name || "--- ---",
    branch_id: inventory?.branch_id?.toString() || "0",
    video: inventory?.video || "",
  };

  console.log("unit", unit)
  // Transform unit data for InventoryUnitCard
  const inventoryUnitData: InventoryUnitData[] = unit
    .filter((u) => ["vacant", "occupied", "relocate"].includes(u?.is_active))
    .map((u) => ({
      unitName: u?.unit_name || "--- ---",
      unitId: u?.id?.toString() || "0",
      inventoryId: inventory?.id || 0,
      unitDetails: transformUnitDetails(u) || "",
      status: u?.is_active as "vacant" | "occupied" | "relocate",
      images: u?.images?.map((img) => img.path) || [],
      total_inventory: u?.total_inventory || 0,
      isOccupied: u?.occupant.tenant_id,
    }));

  return {
    pagination: {
      current_page: pagination.current_page,
      total_pages: pagination.total_pages,
    },
    propertiy_details: inventoryData,
    inventory_unit_data: inventoryUnitData,
  };
};
