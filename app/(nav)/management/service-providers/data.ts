import api, { handleAxiosError } from "@/services/api";
import { ServiceProviderApiResponse, ServiceProviderPageData } from "./types";
import { Field } from "@/components/Table/types";
import { toast } from "sonner";

export const serviceProviderFilterOptionsWithDropdown = [
  {
    radio: true,
    label: "Account Type",
    value: [
      { label: "All", value: "all" },
      { label: "Web", value: "web" },
      { label: "Mobile", value: "mobile" },
    ],
  },
];

export const initialServiceProviderPageData: ServiceProviderPageData = {
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

    console.log("Providers")

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

export const inviteProviderByPhone = async (
  formData: FormData
): Promise<boolean> => {
  try {
    const response = await api.post(
      "service-providers/in/invite-provider",
      formData
    );

    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("refetchServiceProvider"));
      if (response) {
        toast.success("Invitation sent");
      }
      return true;
    }
    return false;
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
