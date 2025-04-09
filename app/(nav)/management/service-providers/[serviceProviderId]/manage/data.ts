import api, { handleAxiosError } from "@/services/api";
import type { ServiceProviderData, ServiceProviderPage } from "./types";
import { IndividualServiceProvidersAPIResponse } from "@/app/(nav)/accountant/management/service-providers/[serviceProviderId]/manage/types";
import { toast } from "sonner";


export const serviceProviderData: ServiceProviderData = {
  id: 1,
  avatar: "/empty/avatar-1.svg",
  picture: "/empty/SampleLandlord.jpeg",
  user_tag: Math.random() < 0.5 ? "web" : "mobile",
  full_name: "John Doe",
  email: "john.doe@example.com",
  service_rendered: "Plumbing",
  personal_number: "08012345678",
  address: "123 Main St, Anytown, USA",
  state: "Lagos",
  local_government: "Ikeja",
  company_details: {
    name: "John Doe Plumbing",
    email: "john.doe@example.com",
    phone_number: "08012345678",
    address: "123 Main St, Anytown, USA",
  },
  bank_details: {
    bank_name: "Access Bank",
    account_number: "1234567890",
    account_name: "John Doe",
  },
  notes: {
    last_updated: "2021-01-01",
    write_up:
      "Hello World How are you doing today? Dont come late to work tomorrow and dont come last in your exams",
  },
};

export const remapServiceProviderData = (data: any): ServiceProviderPage => {
  return {
    user: {
      user_id: data.user_id || null,
    },
    provider: {
      id: data.id,
      avatar: data.avatar,
      full_name: data.name,
      email: data.email,
      user_tag: data.user_tag,
      wallet_id: data.wallet_id,
      phone: data.phone,
    },
    company: {
      name: data.company_name,
      phone: data.company_phone,
      about: data.note,
      service_rendered: data.service_render,
      avatar: data.avatar,
      address: data.address,
      state: data.state,
      local_government: data.local_government,
    },
    bank: {
      name: data.bank_name || null,
      account_name: data.account_name || null,
      account_number: data.account_number || null,
    },
  };
};

export const transformIndividualServiceProviderApiResponse = ({
  data,
}: IndividualServiceProvidersAPIResponse): ServiceProviderData => {
  return {
    id: data.id,
    avatar: data.avatar,
    user_tag: data.user_tag,
    full_name: data.name,
    email: data.email,
    service_rendered: data.service_render,
    personal_number: data.phone,
    address: data.address,
    state: data.state,
    local_government: data.local_government,
    company_details: {
      name: data.company_name,
      email: data.email,
      phone_number: data.company_phone,
      address: data.address,
    },
    bank_details: {
      bank_name: data.bank_name,
      account_number: data.account_number,
      account_name: data.company_name,
    },
    notes: {
      last_updated: data.notes?.last_updated || "",
      write_up: data.notes?.write_up || "",
    },
  };
};

export const updateServiceProvider = async (
  id: string,
  formData: FormData
): Promise<boolean> => {
  try {
    const { data } = await api.post(`service-providers/${id}`, formData);
    if (
      data.status === "success" ||
      data.message === "Provider Updated Successfully"
    ) {
      toast.success("Provider Updated Successfully!");
      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error, "Failed to update service provider");
    return false;
  }
};

export const updateServiceProviderDetails = async (
  id: string,
  formData: FormData
) => {
  try {
    const { data } = await api.post(`service-providers/${id}`, formData);

    console.log(data);
    if (data.status === "success") {
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to update profile");
    return false;
  }
};

export const updateServiceProviderProfile = async (
  id: string,
  formData: FormData
) => {
  try {
    const { data } = await api.post(`service-providers/${id}`, formData);

    if (data.status === "success") {
      toast.success("Profile Updated");
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to update profile");
    return false;
  }
};

export const updateProviderCompanyDetails = async (
  id: string,
  formData: FormData
) => {
  try {
    const { data } = await api.post(`url/${id}`, formData);
    if (data.status === 200 || data.status === "success") {
      toast.success("Company details updated");
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteServiceProvider = async (id: string) => {
  try {
    await api.delete(`service-providers/${id}`);
    window.dispatchEvent(new Event("refetchServiceProvider"));
    return true;
  } catch (error) {
    handleAxiosError(error, "Failed to delete service provider");
    return false;
  }
};

export const updateProviderBankDetails = async (
  id: string,
  formData: FormData
) => {
  try {
    const { data } = await api.post(`service-providers/${id}`, formData);
    if (data.status === 200 || data.status === "success") {
      toast.success("Bank details updated");
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to bank details");
    return false;
  }
};

export const updateProviderNotes = async (id: string, formData: FormData) => {
  try {
    console.log(formData)
    const { data } = await api.post(`service-providers/${id}`, formData);
    if (data.status === 200 || data.status === "success") {
      toast.success("Note updated");
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to update notes");
    return false;
  }
};

export const updateServiceProviderPicture = async (
  id: string,
  payload: FormData
) => {
  try {
    const { data } = await api.post(`service-providers/${id}`, payload);
    if (data.status === 200 || data.status === "success") {
      toast.success("Picture updated");
      return true;
    }
  } catch (error) {
    handleAxiosError(error, "Failed to update picture");
    return false;
  }
};

export const updateServiceProviderWithEmailOrID = async (
  data: any,
  id: number
) => {
  try {
    const res = await api.post(`service-providers/update/email/${id}`, data);
    if (res.status === 201) {
      window.dispatchEvent(new Event("updateServiceProvider"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// Define the valid colors used for badge display
export const validBadgeColors = [
  "green",
  "black",
  "blue",
  "red",
  "yellow",
  "gray",
] as const;

export type BadgeIconColors = typeof validBadgeColors[number];

// Map tier_id numbers to colors
export const tierColorMap: Record<number, BadgeIconColors> = {
  1: "red",
  2: "yellow",
  3: "blue",
  4: "green",
  5: "black",
};

// Extract a safe color based on the tier_id, with fallback to "gray"
const getBadgeColor = (tierId: number | undefined | null): BadgeIconColors => {
  const color = tierId ? tierColorMap[tierId] : undefined;
  return validBadgeColors.includes(color as BadgeIconColors)
    ? (color as BadgeIconColors)
    : "gray"; // Fallback color
};

// Transform user card data into expected UI format
export const transformUserCardData = (data: any) => {
  return {
    name: data.name || data?.user?.name || "",
    picture_url: data.avatar || "",
    email: data.email || "",
    phone_number: data.phone ?? data?.user?.phone ?? "",
    user_tag: data?.agent || "",
    note: data?.note || "",
    badge_color: getBadgeColor(data?.user?.tier_id),
  };
};
