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
  profile: "/settings/profile",
  setting: "/settings",
  listing: "/listings",
  location: "/settings",
  subscription: "/settings/subscription",
  "wallet transaction": "/wallet",
  "rent and unit": "management/rent-unit",
  "agent community": "/management/agent-community",
  "property draft": "/properties/drafts",
  "property request": "/management/agent-request",
};
