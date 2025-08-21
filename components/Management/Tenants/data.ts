import { toast } from "sonner";
import api, { handleAxiosError } from "@/services/api";

export const addTenant = async (
  formData: Record<string, any>
): Promise<boolean | any> => {
  try {
    const data = await api.post("tenant", formData);
    if (data?.status === 200 || data?.status === 201) {
      toast.success("Tenant created successfully");
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to create tenant");
    return false;
  }
};

export const inviteTenantEmail = async (formData: any) => {
  try {
    const { data } = await api.post("tenant/invitation", formData);
    toast.success(data?.message || "Tenant invited successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to invite tenant");
    return false;
  }
};

export const multipleInviteTenants = async (formData: FormData) => {
  try {
    const { data } = await api.post("tenant/multiple/invitation", formData);
    toast.success(data?.message || "Tenants invited successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to invite tenants");
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

export const multipleCreateTenants = async (formData: FormData) => {
  try {
    const { data } = await api.post("/tenant/multiple/creation", formData);
    toast.success(data?.message || "Tenants created successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to create tenants profiles");
    return false;
  }
};

export const deleteTenant = async (id: number) => {
  try {
    const { data } = await api.delete(`tenant/${id}`);
    toast.success(data?.message || "Tenant deleted successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to delete tenant");
    return false;
  }
};

export const deleteLanlord = async (id: number) => {
  try {
    const { data } = await api.delete(`landlord/${id}`);
    toast.success(data?.message || "Tenant deleted successfully");
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to delete tenant");
    return false;
  }
};
