// Imports
import { toast } from "sonner";

export interface StateType {
  state: string;
  lga: string;
  city: string;
  selectedBranch: string;
  staff: { id: string; label: string }[];
  staffOptions: string[];
  images: string[];
  branchOptions: string[];
  inventoryOptions: string[];
  landlordOptions: string[];
  accountOfficerOptions: string[];
  resetKey: number;
}

export const proerty_state_data: StateType = {
  state: "",
  lga: "",
  city: "",
  selectedBranch: "",
  staff: [],
  staffOptions: [],
  images: [],
  branchOptions: [],
  inventoryOptions: [],
  landlordOptions: [],
  accountOfficerOptions: [],
  resetKey: 0,
};

export const addProperty = async (
  formData: FormData,
  accessToken: string | null
): Promise<boolean> => {
  const isSuccess = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/properties`,
      {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const data = await response.json();

    console.log(data);

    if (!response.ok) {
      toast.error(`${data.message ?? ""}. ${data.error ?? ""}`);
    }
  } catch (error) {
    console.log("Error adding property:", error);
    toast.error("Failed to add property. Please try again.");
  }

  return isSuccess;
};
