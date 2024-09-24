// Imports
import { toast } from "sonner";

export const updateTenant = async ({
  id,
  formData,
  accessToken,
}: {
  id: string;
  formData: FormData;
  accessToken: string | null;
}): Promise<boolean> => {
  let isSuccess = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants/${id}`,
      {
        method: "POST",
        body: formData,
        mode: "no-cors",
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
    console.error("Error updating tenant:", error);
    toast.error("Failed to update tenant. Please try again.");
  }

  return isSuccess;
};
