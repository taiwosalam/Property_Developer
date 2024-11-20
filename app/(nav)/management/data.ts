// IMPORTS
import api from "@/services/api";
import axios from "axios";
import { toast } from "sonner";

export const createInventory = async (formData: FormData) => {
  console.log("formData - ", formData);
  try {
    const items: {
      description?: string;
      image?: string;
      [key: string]: any;
    }[] = [];
    let title = "";
    let video_link = "";

    // Extract form data
    Array.from(formData.entries()).forEach(async ([key, value]) => {
      if (key === "title") {
        title = value.toString();
      } else if (key === "video_link") {
        video_link = value.toString();
      } else if (key.startsWith("items[")) {
        // Parse the index from the key (e.g., "items[0][description]")
        const matches = key.match(/items\[(\d+)\]\[(\w+)\]/);
        if (matches) {
          const [, index, field] = matches;
          const i = parseInt(index);

          // Initialize item if it doesn't exist
          if (!items[i]) {
            items[i] = {};
          }

          // Handle image separately for base64 conversion
          if (field === "picture" && value instanceof File) {
            const base64 = await convertFileToBase64(value);
            items[i][field] = base64;
          } else {
            items[i][field] = value;
          }
        }
      }
    });

    const payload = {
      title,
      video_link,
      items: items.filter((item) => item !== null),
    };

    const response = await api.post("/inventory", payload);
    return response.status === 200 || response.status === 201;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const errorMessage =
        error.response.data?.message ||
        "Failed to create inventory. Please try again.";
      toast.error(errorMessage);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
    return false;
  }
};

// Helper function to convert File to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
