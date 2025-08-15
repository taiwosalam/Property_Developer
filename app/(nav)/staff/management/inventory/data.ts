import api, { handleAxiosError } from "@/services/api";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { convertFileToBase64 } from "@/app/(nav)/management/data";

export const createInventory = async (
  formData: FormData,
  inventoryID: number,
  unitId: number
) => {
  try {
    // Log all entries in formData
    Array.from(formData.entries()).forEach(([key, value]) => {
      console.log(`${key}:`, value);
    });

    const response = await api.post(
      `/inventory/${inventoryID}/${unitId}`,
      formData
    );
    if (response.status === 200 || response.status === 201) {
      return true;
    }
  } catch (error) {
    console.error("Error in createInventory:", error);
    handleAxiosError(error);
    return false;
  }
};

export const updateInventory = async (
  formData: FormData,
  InventoryId: number,
  unitId: number
) => {
  try {
    const response = await api.post(
      `/inventory/${InventoryId}/${unitId}`,
      formData
    );
    return response.status === 200 || response.status === 201;
  } catch (error) {
    handleAxiosError(error);
    console.error("Error in updateInventory:", error);
    return false;
  }
};

export const getInventory = async () => {
  try {
    const response = await api.get("/inventories");
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};

export const deleteInventory = async (id: string) => {
  try {
    const response = await api.delete(`/inventory/${id}`);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error deleting inventory:", error);
    return false;
  }
};

export const getBranches = async () => {
  try {
    const response = await api.get("/branches/select");
    return response.data;
  } catch (error) {
    console.error("Error fetching branches:", error);
    return [];
  }
};

export const inventoryFIltersOptionsWithDropdown = [
  {
    radio: true,
    label: "Status",
    value: [
      { label: "Used Inventories", value: "used" },
      { label: "Un-used Inventories", value: "unused" },
    ],
  },
];
