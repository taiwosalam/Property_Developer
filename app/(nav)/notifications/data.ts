import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

export type Notification = {
  id: number;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    subject: string;
    message: string;
    action_text: string;
    action_url: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  from_id: number | null;
};

export type NotificationApiResponse = {
  data: Notification[];
};

export type TNotificationData = {
  notifications: {
    id: number;
    type: string;
    subject: string;
    message: string;
    time: string;
    from_id: number | null;
  }[]
}

function extractNotificationType(notificationType: string): string {
  const match = notificationType.match(/([^\\]+)Notification$/);
  if (!match) return notificationType;

  return match[1].replace(/([a-z])([A-Z])/g, "$1 $2");
}
export function formatDateTime(timestamp: string): string {
  return dayjs(timestamp).fromNow();

}

export const transformNotificationData = (data: NotificationApiResponse): TNotificationData => {

  return {
    notifications: data.data.map((notification) => ({
      id: notification.id,
      type: extractNotificationType(notification.type),
      subject: notification.data.subject,
      message: notification.data.message,
      time: formatDateTime(notification.created_at),
      from_id: notification.from_id
    })),
  }
}