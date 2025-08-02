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

  examine: NotificationReview,
  inspection: NotificationReview,
  announcement: NotificationReview,
  application: NotificationReview,
  trash: NotificationReview,
  complain: NotificationReview,

  subscription: NotificationReservation,
  "wallet transaction": NotificationPayment,
  "rent and unit": NotificationProperty,
  "agent community": NotificationService,
  "new request published": NotificationProperty,
  "property draft": NotificationProperty,
  "new property request": NotificationPropertyRequest,
  "new post published": NotificationService,
  "property request": NotificationProperty,
  "call request": NotificationMessage,
  "agent request": NotificationService,
 // "App\Notifications\NewRequestPublished": NotificationMessage,

};

export const notification_links: Record<string, string> = {
  user: "/settings/company",
  review: "/reviews",
  message: "/messages",
  invoice: "/wallet",
  profile: "/settings/company",
  setting: "/settings",
  listing: "/listing/units",
  location: "/settings",
  application: "/tasks/application",
  complain: "/tasks/complaints",
  trash: "/tasks/undo",
  examine: "/tasks/examine",
  announcement: "/tasks/announcements",
  inspection: "/tasks/inspections",
  subscription: "/settings/subscription",
  "wallet transaction notification": "/wallet",
  "rent and unit notification": "/management/rent-unit",
  "agent community": "/community/agent-forum",
  "property draft notification": "/listing/property",
  "property request notification": "/community/agent-request",
  "invoice notification": "/accounting/invoice",
  "agent request": "/community/agent-request",
  "new post published": "/community/agent-forum",
  "listing notification": "/listing/units",
  "company setting notification": "/settings/company",
  "subscription notification": "/settings/subscription",
  "new request published": "/tasks/property-requests",
  "call request": "/tasks/call-requests",

};

export const normalizeNotificationType = (fullType: string) => {
  const parts = fullType.split("\\");
  const lastPart = parts[parts.length - 1] || "";
  return lastPart
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .trim(); // "new request published"
};
