import { StaticImageData } from "next/image";

// Types
import type { NotificationType } from "./types";

// Images
import NotificationUser from "@/public/icons/notification-user.svg";
import NotificationReview from "@/public/icons/notification-review.svg";
import NotificationMessage from "@/public/icons/notification-message.svg";
import NotificationPayment from "@/public/icons/notification-payment.svg";
import NotificationProfile from "@/public/icons/notification-profile.svg";
import NotificationService from "@/public/icons/notification-service.svg";
import NotificationProperty from "@/public/icons/notification-property.svg";
import NotificationReservation from "@/public/icons/notification-reservation.svg";

export const notification_icons: Record<string, StaticImageData> = {
  user: NotificationUser,
  review: NotificationReview,
  message: NotificationMessage,
  setting: NotificationPayment,
  profile: NotificationProfile,
  "agent community": NotificationService,
  "property draft": NotificationProperty,
  "property request": NotificationProperty,
  "subscription": NotificationReservation,
};
