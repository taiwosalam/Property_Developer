import { toast } from "sonner";

export const addTenant = async (
  formData: FormData,
  accessToken: string | null
): Promise<boolean> => {
  let isSuccess = false;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants`,
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

    isSuccess = true;
  } catch (error) {
    console.error("Error adding tenant:", error);
    toast.error("Failed to add tenant. Please try again.");
  }

  return isSuccess;
};

export const addMultipleTenants = async (formData: any) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/tenants/import`,
      { method: "POST", body: formData }
    ).then((res) => res.json());

    console.log(response);
  } catch (error) {
    console.error("Error adding multiple tenants:", error);
  }
};
