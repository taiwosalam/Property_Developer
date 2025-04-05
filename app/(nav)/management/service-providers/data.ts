import api, { handleAxiosError } from "@/services/api";
import { ServiceProviderApiResponse, ServiceProviderPageData, ServiceProviderResponseApi } from "./types";
import { Field } from "@/components/Table/types";
import { toast } from "sonner";

export const serviceProviderFilterOptionsWithDropdown = [
  {
    radio: true,
    label: "Account Type",
    value: [
      { label: "All Service Providers", value: "all" },
      { label: "Web Service Providers", value: "web" },
      { label: "Mobile Service Providers", value: "mobile" },
    ],
  },
];

export const initialServiceProviderPageData = {
  total_pages: 1,
  current_page: 1,
  total_users: 0,
  total_user_this_month: 0,
  mobile_users: 0,
  mobile_users_this_month: 0,
  vacant_units: 0,
  vacant_units_this_month: 0,
  providers: [],
};

export const getAllServiceProviders = async () => {
  try {
    const response = await api.get("service-providers");
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return "Error fetching service provider: " + error.message;
    }
  }
};

export const createServiceProvider = async (
  formData: FormData
): Promise<boolean> => {
  try {
    const response = await api.post("service-providers", formData);

    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetchServiceProvider"));
      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const inviteProviderByPhone = async (formData: FormData) => {
  try {
    const response = await api.post(
      "service-providers/in/invite-provider",
      formData
    );

    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetchServiceProvider"));
      toast.success("Invitation sent");
      return true
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
export const inviteByIdOrEmail = async (formData: FormData) => {
  try {
    const response = await api.post(
      "/service-providers/add/email",
      formData
    );

    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetchServiceProvider"));
      toast.success("Service provider added successfully");
      return true
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};


export const ServiceProviderTableFields: Field[] = [
  {
    id: "1",
    accessor: "avatar",
    isImage: true,
    cellStyle: { paddingRight: "4px" },
  },
  {
    id: "2",
    accessor: "full_name",
    cellStyle: {
      paddingLeft: "4px",
      fontWeight: 700,
      color: "#000",
    },
  },
  {
    id: "3",
    accessor: "email",
    cellStyle: {
      whiteSpace: "nowrap",
    },
  },
  {
    id: "4",
    accessor: "phone",
    cellStyle: {
      whiteSpace: "nowrap",
    },
  },
  { id: "5", accessor: "service_render" },
  { id: "6", accessor: "manage/chat" },
];


export const transformServiceProviderData = (response: ServiceProviderResponseApi): ServiceProviderPageData => {
  const { data  } = response
  return {
    total: data?.total,
    current_page: data?.providers?.current_page,
    total_mobile: data?.total_mobile,
    total_mobile_month: data?.total_mobile_month,
    total_month: data?.total_month,
    total_web: data?.total_web,
    total_web_month: data?.total_web_month,
    total_pages: data?.providers?.last_page,
    service_providers: data?.providers?.data.map((provider) => ({
      id: provider?.id,
      name: provider.name,
      email: provider?.email,
      phone: provider?.phone,
      agent: provider?.agent,
      avatar: provider?.avatar,
      badge_color: provider?.user_tier,
      note: provider?.note,
      service_rendered: provider?.service_render ?? "",
    }))

    
  }
}