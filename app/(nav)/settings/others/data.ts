import api, { handleAxiosError } from "@/services/api";
import { objectToFormData } from "@/utils/checkFormDataForImageOrAvatar";
import {
  ApiResponseDirector,
  ApiResponseUserPlan,
  CompanySettingsResponse,
} from "./types";
import { toast } from "sonner";
import { AnyARecord } from "dns";
import { headers } from "next/headers";

export const addNewDirector = async (formData: FormData): Promise<boolean> => {
  try {
    //const data = objectToFormData(formData);
    const response = await api.post("/directors/create", formData);

    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("addNewDirector"));

      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
export const updateDirector = async (
  formData: FormData,
  id: string
): Promise<boolean> => {
  try {
    //const data = objectToFormData(formData);
    formData.append("_method", "PATCH");
    const response = await api.post(`/directors/${id}`, formData);

    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("addNewDirector"));

      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const deleteDirector = async (id: string): Promise<boolean> => {
  try {
    const response = await api.delete(`/directors/${id}`);

    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("addNewDirector"));
      return true;
    }
    return false;
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
export const updateCompanyType = async (companyName: string) => {
  try {
    const formData = new FormData();
    formData.append(companyName, companyName);
    const response = await api.patch("company/settings/module");
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("updateCompanyType"));
      toast.success("Company type updated");
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateCompanyNotification = async (data: any) => {
  try {
    const response = await api.patch("company/settings/notifications", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200 || response.status === 201) {
      toast.success("Notification updated");
      window.dispatchEvent(new Event("otherSettings"));
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

// subscription_due_rent_notification, general_notification, sms_notification, email_notification

export const otherNotificationSettings = async (
  endpoint: string,
  data: any
) => {
  try {
    const response = await api.patch(`company/settings/${endpoint}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      //toast.success("Notification updated");
      window.dispatchEvent(new Event("otherSettings"));
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const selectCompanyModule = async (companyId: string, data: any) => {
  try {
    const response = await api.post(`/company/${companyId}/change-type`, data);
    if (response.status === 200 || response.status === 201) {
      toast.success("Company type updated");
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const updateMessageAndReviewSettings = async (data: any) => {
  try {
    const response = await api.patch(
      `company/settings/messages_review_settings`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200 || response.status === 201) {
      toast.success("Message review settings updated");
      window.dispatchEvent(new Event("otherSettings"));
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const restrictUserFromGroupChat = async (data: any) => {
  try {
    const response = await api.post("company/users-restrict", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("restrictedUser"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const restoreUserToGroupChat = async (data: any) => {
  try {
    const response = await api.post("url", data);
    if (response.status === 200 || response.status === 201) {
      toast.success("Success");
      window.dispatchEvent(new Event("restrictedUser"));
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const showSelectedTenant = async (tenantId: string) => {
  try {
    const response = await api.get(`/tenant/${tenantId}`);
    if (response.status === 200 || response.status === 201) {
      window.dispatchEvent(new Event("restrictedUser"));
    }
    return response;
  } catch (error) {
    handleAxiosError(error);
  }
};

export const updateResetSettings = async (data: string[]) => {
  try {
    const payload = { types: data };
    const response = await api.post("company/settings/reset", payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200 || response.status === 201) {
      toast.success("Settings updated");
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export type DirectorCardProps = {
  card: {
    id: number;
    about_director: string;
    years_in_business: string;
    state: string;
    lga: string;
    name: string;
    title: string;
    picture: string | null;
    full_name: string;
    email: string;
    phone_number: string;
    professional_title: string;
    tier_id: number;
    is_verified: boolean;
    //avatar: string;
  }[];
};
export function transfromToDirectorCards(
  data: ApiResponseDirector
): DirectorCardProps {
  const { data: apiData } = data;

  return {
    card: apiData?.directors.map((item) => {
      return {
        id: item?.id,
        is_verified: item?.user?.profile.bvn ? true : false,
        picture: item?.profile_picture ?? item?.user?.profile?.picture,
        //avatar: item?.user?.profile?.picture ?? "/empty/avatar.png",
        full_name: item?.user?.profile?.title
          ? `${item?.user?.profile?.title} ${item.full_name}`
          : item.full_name,
        email: item?.user?.email,
        name: item?.full_name,
        tier_id: item?.user?.tier_id,
        phone_number: item?.phone_number || "___ ___",
        professional_title: item?.professional_title ?? "___ ___",
        about_director: item?.about_director ?? "___ ___",
        years_in_business: item?.years_in_business ?? "___ ___",
        state: item?.user?.profile?.state ?? "___ ___",
        lga: item?.user?.profile?.lga ?? "___ ___",
        title: item?.user?.profile?.title ?? "___ ___",
      };
    }),
  };
}

export interface ITransformedOtherSettings {
  company_module: boolean;
  notification: {
    company_default_module: number;
    document_creation: boolean;
    new_messages: boolean;
    task_updates: boolean;
    profile_changes: boolean;
    property_vacant: boolean;
    profile_approval: boolean;
    property_approval: boolean;
    reviews: boolean;
    sms_notification: boolean;
    messages: boolean;
    general_notification: boolean;
    account_officer: boolean;
    email_notification: boolean;
    landlord_landlady: boolean;
    assign_staff: boolean;
    subscription_due_rent_notification: boolean;
  };
}
export const transformOtherSetting = (
  apiData: CompanySettingsResponse
): ITransformedOtherSettings => {
  const { data } = apiData;
  return {
    company_module: true,
    notification: {
      document_creation: data?.notifications?.document_creation,
      company_default_module: data?.company_default_module ?? "1",
      new_messages: data?.notifications?.new_messages,
      task_updates: data?.notifications?.task_updates,
      profile_changes: data?.notifications?.profile_changes,
      property_vacant: data?.notifications?.property_vacant,
      profile_approval: data?.notifications?.profile_approval,
      property_approval: data?.notifications?.profile_approval,
      messages: data?.messages_review_settings.messages,
      sms_notification: data?.sms_notification,
      account_officer: data?.messages_review_settings?.account_officer,
      general_notification: data?.general_notification,
      landlord_landlady: data?.messages_review_settings?.landlord_landlady,
      email_notification: data?.email_notification,
      assign_staff: data?.messages_review_settings?.assign_staff,
      reviews: data?.messages_review_settings?.reviews,
      subscription_due_rent_notification:
        data?.subscription_due_rent_notification,
    },
  };
};
