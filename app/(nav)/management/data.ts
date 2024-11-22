
// IMPORTS
import api from "@/services/api";
import axios from "axios";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export const useFetchInventoryAndBranch = () => {
  const [branches, setBranches] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [branchResponse, inventoryResponse] = await Promise.all([
          api.get("/branches"),
          api.get("/inventories"),
        ]);

        setBranches(branchResponse.data || []);
        setInventory(inventoryResponse.data || []);
      } catch (err) {
        setError(err as any);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { branches, inventory, loading, error };
};


// Helper function to convert File to base64
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
