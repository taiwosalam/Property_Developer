import React, { useState } from "react";
// Types
//import type { NotificationProps } from "./types";

// Images
import Avatar from "@/public/empty/avatar-1.svg";
import VerifiedIcon from "@/public/icons/verified.svg";

// Imports
import { empty } from "@/app/config";
import Picture from "../Picture/picture";
import { notification_icons } from "./data";
import { SectionSeparator } from "../Section/section-components";
import useFetch from "@/hooks/useFetch";

interface NotificationProps {
  notification: {
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
  };
}
const Notification: React.FC<NotificationProps> = ({ notification }) => {
  return (
    <div className="custom-flex-col gap-4">
      <div className="flex gap-4">
        <div className="flex items-start">
          <Picture
            src={
              notification_icons[notification.type?.toLocaleLowerCase()] ||
              empty
            }
            alt="message"
            size={50}
          />
        </div>
        <div className="flex-1 custom-flex-col gap-2">
          <div className="custom-flex-col gap-1">
            <p>
              <span className="text-text-primary text-base font-medium">
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
          <div className="py-2 px-4 rounded-md bg-brand-1 flex gap-3">
            <SectionSeparator
              direction="y"
              style={{ backgroundColor: "#787A7E" }}
            />
            <div className="flex gap-2 py-2">
              {notification.sender_picture &&
                notification.sender_picture !== "/img/system-logo.png" && (
                  <div className="flex items-center">
                    <Picture
                      src={notification.sender_picture ?? Avatar}
                      alt="profile picture"
                      size={50}
                      className="rounded-md"
                    />
                  </div>
                )}
              <div className="custom-flex-col">
                <div className="flex items-center gap-2">
                  <p className="text-text-secondary text-sm font-medium capitalize">
                    {notification.sender_name &&
                      notification?.sender_name !== "System" &&
                      notification.sender_name}
                  </p>
                  {notification.sender_name &&
                    notification?.sender_name !== "System" && (
                      <Picture src={VerifiedIcon} alt="verified" size={14} />
                    )}
                </div>
                {/*<p className="text-text-tertiary text-sm font-medium">
                  You just got 4 new messages sent by @username
                </p> */}
                {notification?.message}
              </div>
            </div>
          </div>
        </div>
      </div>
      <SectionSeparator />
    </div>
  );
};

export default Notification;
