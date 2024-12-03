import api, { handleAxiosError } from "@/services/api";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { convertFileToBase64 } from "../data";

export const createInventory = async (formData: FormData) => {
    try {
      console.log('Starting createInventory function');
      
      // Log all entries in formData
      Array.from(formData.entries()).forEach(([key, value]) => {
        console.log(`${key}:`, value);
      });
      
    const response = await api.post("/inventory", formData);
      
      return response.status === 200 || response.status === 201;
    } catch (error) {
      console.error('Error in createInventory:', error);
      // if (axios.isAxiosError(error)) {
      //   const errorMessage = error.response?.data?.message || "Failed to create inventory.";
      //   console.error('Axios error details:', error.response?.data);
      //   toast.error(errorMessage);
      // } else {
      //   const errorMessage = error instanceof Error ? error.message : "Failed to create inventory.";
      //   toast.error(errorMessage);
      // }
      handleAxiosError(error)
      return false;
    }
}

export const updateInventory = async (formData: FormData, id: string) => {
  try {
    const response = await api.put(`/inventory/${id}`, formData);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.error("Error in updateInventory:", error);
    return false;
  }
}

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
}

export const getBranches = async () => {
    try { 
      const response = await api.get("/branches");
      return response.data;
    } catch (error) {
      console.error("Error fetching branches:", error);
      return [];
    }
  };
  