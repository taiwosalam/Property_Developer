import { toast } from "sonner";
import api, { handleAxiosError } from "@/services/api";

export const addTenant = async (
  formData: Record<string, any>
): Promise<boolean | any> => {
  try {
    const { data } = await api.post("tenant", formData);
    toast.success(data?.message || "Tenant created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create tenant");
    return false;
  }
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
