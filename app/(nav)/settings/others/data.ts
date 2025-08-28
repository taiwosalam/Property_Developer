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

export const lockDirector = async (id: string): Promise<boolean> => {
  try {
    const response = await api.post(`/directors/${id}/lock`);

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

export const updateNotificationSettings = async (data: any) => {
  try {
    const res = await api.patch(`/notification/update`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 || res.status === 201) {
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
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
    is_active: boolean;
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
        id: item?.user_id,
        is_verified: item?.is_verified,
        picture: item?.picture,
        full_name: item?.name,
        email: item?.email,
        is_active: item?.is_active,
        name: item?.full_name,
        tier_id: item?.tier_id,
        phone_number: item?.phone_number || "___ ___",
        professional_title: item?.professional_title ?? "___ ___",
        about_director: item?.about_director ?? "___ ___",
        years_in_business: item?.years_in_business ?? "___ ___",
        state: item?.state ?? "___ ___",
        lga: item?.lga ?? "___ ___",
        title: item?.title ?? "",
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

export const notificationCategories = [
  {
    title: "Management",
    desc: "Stay updated on company-wide activities, approvals, and property status changes.",
    options: [
      {
        name: "vehicle_activity_summary",
        text: "Vehicle activity summary (daily/weekly/monthly)",
      },
      {
        name: "management_summary",
        text: "Management summary (weekly/monthly)",
      },
      {
        name: "property_invite_approved_rejected",
        text: "Property invite approved/rejected",
      },
      { name: "drafted_property_reminder", text: "Drafted property reminder" },
      {
        name: "tenant_branch_staff_company_limit_alerts",
        text: "Tenant/branch/staff/company limit alerts",
      },
      {
        name: "new_property_awaiting_approval",
        text: "New property awaiting approval",
      },
      { name: "property_vacant_listed", text: "Property vacant & listed" },
      {
        name: "new_landlord_tenant_profile_awaiting_approval",
        text: "New landlord/tenant profile awaiting approval",
      },
    ],
  },
  {
    title: "Rent & Payments",
    desc: "Get alerts for rent creation, due dates, expiries, payments, and property/unit changes.",
    options: [
      { name: "new_rent_created", text: "New rent created" },
      { name: "rent_due_reminder", text: "Rent due reminder" },
      { name: "rent_expired", text: "Rent expired" },
      { name: "late_payment_warning", text: "Late payment warning" },
      { name: "part_payment_made", text: "Part payment made" },
      { name: "upfront_payment_received", text: "Upfront payment received" },
      { name: "renewal_processed", text: "Renewal processed" },
      { name: "property_change_update", text: "Property change update" },
      { name: "unit_change_update", text: "Unit change update" },
    ],
  },
  {
    title: "Tasks & Workflow",
    desc: "Track all applications, complaints, tasks, inspections, and maintenance progress.",
    options: [
      { name: "new_application_pending", text: "New application pending" },
      {
        name: "complaint_updates",
        text: "Complaint updates (new/approved/rejected/comments)",
      },
      { name: "task_progress_update", text: "Task progress update" },
      { name: "new_note_added", text: "New note added" },
      {
        name: "inspection_created_completed",
        text: "Inspection created/completed",
      },
      {
        name: "examination_created_report_ready",
        text: "Examination created/report ready",
      },
      { name: "maintenance_reminder", text: "Maintenance reminder" },
    ],
  },
  {
    title: "Calendar & Reminders",
    desc: "Never miss important deadlines, events, or pending activities.",
    options: [
      {
        name: "daily_weekly_monthly_events",
        text: "Daily/weekly/monthly events",
      },
      { name: "rent_expiry_reminder", text: "Rent expiry reminder" },
      { name: "pending_applications", text: "Pending applications" },
      { name: "pending_inspections", text: "Pending inspections" },
      { name: "upcoming_maintenance", text: "Upcoming maintenance" },
      { name: "upcoming_examinations", text: "Upcoming examinations" },
      { name: "pending_call_requests", text: "Pending call requests" },
    ],
  },
  {
    title: "Announcements & Requests",
    desc: "Receive updates on new announcements, call requests, and property/deposit requests.",
    options: [
      { name: "new_announcements", text: "New announcements" },
      { name: "new_call_request", text: "New call request" },
      {
        name: "property_request_updates",
        text: "Property request (new/approved/rejected/reminder)",
      },
      { name: "deposit_request_updates", text: "Deposit request updates" },
    ],
  },
  {
    title: "Listings",
    desc: "Stay informed about property listings, sponsorships, bookmarks, and drafts.",
    options: [
      { name: "listing_approved_rejected", text: "Listing approved/rejected" },
      { name: "sponsored_listing_update", text: "Sponsored listing update" },
      { name: "bookmarked_property", text: "Bookmarked property" },
      {
        name: "property_request_sent_received",
        text: "Property request sent/received",
      },
      { name: "property_draft_reminder", text: "Property draft reminder" },
    ],
  },
  {
    title: "Accounting",
    desc: "Monitor all invoice and disbursement activities to stay on top of finances.",
    options: [
      { name: "invoice_created", text: "Invoice created" },
      { name: "invoice_paid", text: "Invoice paid" },
      { name: "invoice_due_reminder", text: "Invoice due reminder" },
      { name: "disbursement_processed", text: "Disbursement processed" },
    ],
  },
  {
    title: "Community",
    desc: "Engage with agent community updates, forum posts, contributions, and feedback.",
    options: [
      { name: "new_group_message", text: "New group message" },
      { name: "new_forum_post", text: "New forum post" },
      { name: "new_agent_request", text: "New agent request" },
      {
        name: "contribution_approved_rejected",
        text: "Contribution approved/rejected",
      },
      { name: "new_comment", text: "New comment" },
      { name: "new_like_dislike", text: "New like/dislike" },
    ],
  },
  {
    title: "Settings & Subscriptions",
    desc: "Track subscription updates, system settings, and document verification results.",
    options: [
      {
        name: "subscription_updates",
        text: "Subscription updates (activation/upgrade/renewal/expiry)",
      },
      {
        name: "document_verification_result",
        text: "Document verification result",
      },
      {
        name: "system_settings_addons_updated",
        text: "System settings/add-ons updated",
      },
    ],
  },
  {
    title: "System & Communication",
    desc: "Get notified about call requests and delivery failures for SMS or email.",
    options: [
      { name: "call_request_submitted", text: "Call request submitted" },
      { name: "sms_delivery_failed", text: "SMS delivery failed" },
      { name: "email_delivery_failed", text: "Email delivery failed" },
    ],
  },
  {
    title: "Units & Campaigns",
    desc: "Stay alerted on unit balances, sponsorships, features, and campaign statuses.",
    options: [
      { name: "units_low_exhausted", text: "Units low/exhausted" },
      {
        name: "listing_sponsorship_updates",
        text: "Listing sponsorship (new/expired reminder/expired)",
      },
      { name: "sms_units_low_exhausted", text: "SMS units low/exhausted" },
      {
        name: "feature_subscription_updates",
        text: "Feature subscription (new/expired reminder/expired)",
      },
      {
        name: "campaign_subscription_updates",
        text: "Campaign subscription (new/expired reminder/expired)",
      },
    ],
  },
];
