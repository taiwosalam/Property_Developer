export type NotificationType =
  | "message"
  | "payment"
  | "profile"
  | "service"
  | "review"
  | "reservation"
  | "user"
  | "property";

export interface NotificationProps {
  type: NotificationType;
}
