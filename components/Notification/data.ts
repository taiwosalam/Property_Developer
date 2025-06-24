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
import NotificationInvoice from "@/public/icons/notification-invoice.svg";
import NotificationPropertyRequest from "@/public/icons/property-request.svg";
import NotificationSettings from "@/public/icons/notification-settings.svg";

export const notification_icons: Record<string, StaticImageData | any> = {
  user: NotificationUser,
  review: NotificationReview,
  message: NotificationMessage,
  invoice: NotificationInvoice,
  profile: NotificationProfile,
  setting: NotificationSettings,
  listing: NotificationProperty,
  location: NotificationSettings,
  subscription: NotificationReservation,
  "wallet transaction": NotificationPayment,
  "rent and unit": NotificationProperty,
  "agent community": NotificationService,
  "property draft": NotificationProperty,
  "property request": NotificationPropertyRequest,
};


export const notification_links: Record<string, string> = {
  user: "/settings/company",
  review: "/reviews",
  message: "/messages",
  invoice: "/wallet",
  profile: "/settings/company",
  setting: "/settings",
  listing: "/listings/units",
  location: "/settings",
  subscription: "/settings/subscription",
  "wallet transaction notification": "/wallet",
  "rent and unit notification": "/management/rent-unit",
  "agent community notification": "/community/agent-forum",
  "property draft notification": "/listing/property",
  "property request notification": "/community/agent-request",
  "invoice notification": "/accounting/invoice",
  "new request published": "/community/agent-request",
  "new post published": "/community/agent-forum",
  "listing notification": "/listing/units",
  "company setting notification": "/settings/company",
  "subscription notification": "/settings/subscription",
};


export const normalizeNotificationType = (fullType: string) => {
  const parts = fullType.split("\\");
  const lastPart = parts[parts.length - 1] || "";
  return lastPart
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .trim(); // "new request published"
};
