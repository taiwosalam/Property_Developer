import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

import customParseFormat from "dayjs/plugin/customParseFormat";
import api, { handleAxiosError } from "@/services/api";
import { toast } from "sonner";

dayjs.extend(customParseFormat);

export type Notification = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    subject: string;
    message: string;
    title: string;
    action_text: string;
    action_url: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  from_id: number | null;
  sender_name: string;
  sender_picture: string;
};

export type NotificationApiResponse = {
  data: Notification[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type TNotificationData = {
  notifications: {
    id: string;
    type: string;
    action_text: string;
    subject: string;
    message: string;
    time: string;
    from_id: number | null;
    sender_name: string;
    sender_picture: string;
  }[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

function extractNotificationType(notificationType: string): string {
  const match = notificationType.match(/([^\\]+)Notification$/);
  if (!match) return notificationType;

  return match[1].replace(/([a-z])([A-Z])/g, "$1 $2");
}
export function formatDateTime(timestamp: string): string {
  return dayjs(timestamp).fromNow();
}

export const formatTime = (timeString: string) => {
  return dayjs(timeString, "HH:mm:ss").format("h:mmA"); // Formats to 12-hour format with AM/PM
};

export const transformNotificationData = (
  data: NotificationApiResponse
): TNotificationData => {
  return {
    notifications: data.data.map((notification) => ({
      id: notification.id,
      action_text: notification?.data?.action_text || "",
      type: extractNotificationType(notification.type),
      subject: notification.data.subject || notification?.data?.title || "",
      message: notification.data.message || "",
      time: notification.created_at
        ? formatDateTime(notification.created_at)
        : "",
      from_id: notification.from_id,
      sender_name: notification.sender_name?.toLowerCase() || "",
      sender_picture: notification?.sender_picture ?? "",
    })),
    meta: {
      total: data?.meta.total,
      current_page: data?.meta?.current_page,
      last_page: data?.meta?.last_page,
      per_page: data?.meta?.per_page,
    },
  };
};

export const clearAllNotification = async (ids: string[]) => {
  const payload = {
    notification_ids: ids,
  };

  try {
    const res = await api.post(`/notifications/mark-read`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("refetchNotifications"));
      //toast.success("Notifications Cleared");
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};
export const deleteAllNotification = async (ids: string[]) => {
  const payload = {
    notification_ids: ids,
  };

  try {
    const res = await api.post(`/notifications/clear-all`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200 || res.status === 201) {
      window.dispatchEvent(new Event("refetchNotifications"));
      return true;
    }
  } catch (error) {
    handleAxiosError(error);
    return false;
  }
};

export const fetchNotifications = async (page: number = 1) => {
  try {
    const response = await api.get(`/notifications?page=${page}`);
    return transformNotificationData(response.data);
  } catch (error) {
    handleAxiosError(error);
    return null;
  }
};
