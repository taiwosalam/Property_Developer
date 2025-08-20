import React, { useState } from "react";
// Types
//import type { NotificationProps } from "./types";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import VerifiedIcon from "@/public/icons/verified.svg";

// Imports
import { empty } from "@/app/config";
import Picture from "../Picture/picture";
import {
  normalizeNotificationType,
  notification_icons,
  
  notification_links,
} from "./data";
import { SectionSeparator } from "../Section/section-components";
import useFetch from "@/hooks/useFetch";
import Link from "next/link";
import { OtherIcon } from "./notification-icons";
import { useRole } from "@/hooks/roleContext";
import { toast } from "sonner";
import { clearAllNotification, deleteAllNotification } from "@/app/(nav)/notifications/data";
import Image from "next/image";

interface NotificationProps {
  notification: {
    id: string;
    type:
      | "message"
      | "payment"
      | "profile"
      | "service"
      | "review"
      | "reservation"
      | "user"
      | "property"
      | string;
    subject?: string;
    message?: string;
    time?: string;
    from_id: number | null;
    sender_name: string;
    sender_picture: string;
    action_text: string;
  };
}
const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const resolvedType = notification.type.includes("\\")
    ? normalizeNotificationType(notification.type)
    : notification.type.toLowerCase().trim();

  const [imageSrc, setImageSrc] = useState(notification.sender_picture);

  const route = notification_links[resolvedType] || "/";

  const [notificationIds, setNotificationIds] = useState<string[]>([]);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);

  const IconComponent = notification_icons[resolvedType];

  const { role } = useRole();

  const getRoleBasedRoute = (baseRoute: string) => {
    switch (role) {
      case "manager":
        return `/manager${baseRoute}`;
      case "accountant":
        return `/accountant${baseRoute}`;
      case "staff":
        return `/staff${baseRoute}`;
      default:
        return baseRoute;
    }
  };

  const roleRoute = getRoleBasedRoute(route);

  const handleDeleteNotifications = async () => {
    setNotificationIds([notification?.id]);

    if (!notification.id) return;

    try {
      setIsClearingNotifications(true);
      const res = await clearAllNotification([notification.id]);
      if (res) {
        //toast.success("Notifications Cleared");
      }
    } catch (error) {
      //console.error(error);
    } finally {
      setIsClearingNotifications(false);
    }
  };

  return (
    <div className="custom-flex-col gap-4" onClick={handleDeleteNotifications}>
      <div className="flex gap-4">
        <Link href={roleRoute} className="w-full flex gap-4">
          <div className="flex items-start">
            {/* Render the JSX Element icon */}
            {IconComponent ? (
              <IconComponent
                size={50}
                className="w-[50px] h-[50px]"
                alt="notification icon"
              />
            ) : (
              // Fallback icon or empty div
              <div className="w-[50px] h-[50px] bg-gray-200 rounded">
                <OtherIcon />
              </div>
            )}
          </div>
          <div className="flex-1 custom-flex-col gap-2">
            <div className="custom-flex-col gap-1">
              <p>
                <span className="text-text-primary text-base font-medium dark:text-slate-400">
                  {notification?.subject}
                </span>
                {/* <span className="text-text-secondary text-sm font-normal">
                (4 new messages)
              </span> */}
              </p>
              <p className="text-text-secondary text-base font-normal first-letter:uppercase">
                {notification?.time}
              </p>
            </div>
            <div className="py-2 px-4 rounded-md bg-brand-1 flex gap-3 dark:text-black">
              <SectionSeparator
                direction="y"
                style={{ backgroundColor: "#787A7E" }}
              />
              <div className="flex gap-2 py-2">
                {notification.sender_picture &&
                  notification.sender_name !== "system" &&
                  notification.sender_picture !== "/img/system-logo.png" && (
                    <div className="flex items-center">
                      <Picture
                        src={notification.sender_picture}
                        alt="profile picture"
                        size={50}
                        className="rounded-md bg-brand-9"
                      />

                      {/* <Image
                        src={`https://${notification.message}` || imageSrc}
                        width={100}
                        height={100}
                        alt="sample image"
                        onError={() => setImageSrc(empty)}
                      /> */}
                    </div>
                  )}
                <div className="custom-flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-text-secondary text-sm font-medium capitalize">
                      {notification.sender_name &&
                      notification.sender_name !== "system"
                        ? notification.action_text
                        : null}
                    </p>
                    {/* {notification.sender_name &&
                    notification?.sender_name !== "System" && (
                      // <Picture src={VerifiedIcon} alt="verified" size={14} />
                    )} */}
                  </div>
                  {/*<p className="text-text-tertiary text-sm font-medium">
                  You just got 4 new messages sent by @username
                </p> */}
                  <p className="capitalize"> {notification?.message}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
      <SectionSeparator />
    </div>
  );
};

export default Notification;

const Random = () => {
  return (
    <svg
      width="50"
      height="50"
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="50" height="50" rx="8" fill="#FFBB53" />
      <path
        d="M25.0605 15.2517C24.7792 14.9705 24.3977 14.8125 24 14.8125C23.6022 14.8125 23.2208 14.9705 22.9395 15.2517L12.969 25.2207C12.8992 25.2904 12.8439 25.3732 12.8062 25.4643C12.7684 25.5554 12.749 25.6531 12.749 25.7517C12.749 25.8503 12.7684 25.9479 12.8062 26.0391C12.8439 26.1302 12.8992 26.2129 12.969 26.2827C13.1098 26.4235 13.3008 26.5026 13.5 26.5026C13.5986 26.5026 13.6962 26.4832 13.7873 26.4455C13.8785 26.4077 13.9612 26.3524 14.031 26.2827L24 16.3122L33.969 26.2827C34.1098 26.4235 34.3008 26.5026 34.5 26.5026C34.6991 26.5026 34.8901 26.4235 35.031 26.2827C35.1718 26.1418 35.2509 25.9508 35.2509 25.7517C35.2509 25.5525 35.1718 25.3615 35.031 25.2207L31.5 21.6912V16.7517C31.5 16.5528 31.421 16.362 31.2803 16.2213C31.1396 16.0807 30.9489 16.0017 30.75 16.0017H29.25C29.0511 16.0017 28.8603 16.0807 28.7196 16.2213C28.579 16.362 28.5 16.5528 28.5 16.7517V18.6912L25.0605 15.2517Z"
        fill="white"
      />
      <path
        d="M24 17.9375L33 26.9375V33.248C33 33.8447 32.7629 34.417 32.341 34.839C31.919 35.2609 31.3467 35.498 30.75 35.498H17.25C16.6533 35.498 16.081 35.2609 15.659 34.839C15.2371 34.417 15 33.8447 15 33.248V26.9375L24 17.9375Z"
        fill="white"
      />
    </svg>
  );
};
