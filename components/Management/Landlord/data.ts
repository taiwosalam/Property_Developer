// Imports
import { toast } from "sonner";

export const addLandlord = async (
  formData: FormData,
  accessToken: string | null
): Promise<boolean> => {
  let isSuccess = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/landlords/store`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errors = data.errors
        ? Object.values(data.errors).join(" ")
        : "An unexpected error occurred";

      toast.error(errors);
      return isSuccess;
    }

    toast.success(data.message);
    isSuccess = true;
  } catch (error) {
    console.error("Error adding landlord:", error);
    toast.error("Failed to add landlord. Please try again.");
  }

  return isSuccess;
};
