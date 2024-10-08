// Imports
import { toast } from "sonner";

export const addStaff = async (
  formData: FormData,
  accessToken: string | null
): Promise<boolean> => {
  let isSuccess = false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/staffs`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const errors =
        Object.keys(data).length > 0
          ? `${data.error ?? ""} ${data.details ?? ""}`
          : "An unexpected error occurred";

      toast.error(errors);
      return isSuccess;
    }

    toast.success(data.message);
    isSuccess = true;
  } catch (error) {
    console.error("Error adding staff:", error);
    toast.error("Failed to add staff. Please try again.");
  }

  return isSuccess;
};
