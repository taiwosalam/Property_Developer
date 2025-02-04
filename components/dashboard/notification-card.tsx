import clsx from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { notificationCardProps } from "./types";
import messagesIcon from "@/public/icons/message.svg";
import complaintsIcon from "@/public/icons/complaints.svg";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";
import Link from "next/link";
import Picture from "../Picture/picture";

const NotificationCard: React.FC<notificationCardProps> = ({
  sectionHeader,
  notifications,
  branchId,
  className,
  seeAllLink,
}) => {
  console.log("branch data", notifications)
  // Determine the icon and message text based on the sectionHeader prop
  const getEmptyState = () => {
    if (sectionHeader === "Recent Messages") {
      return {
        icon: messagesIcon,
        altText: "Messages Icon",
        message:
          "You do not have any recent messages. You can chat with staff, landlord/landlady, tenants, and occupants.",
      };
    } else if (sectionHeader === "Complaints") {
      return {
        icon: complaintsIcon,
        altText: "Complaints Icon",
        message:
          "You do not have any complaints from tenants or occupants. They can create complaints using the mobile app, and recent complaints will be listed here.",
      };
    } else {
      return {
        icon: "", // default empty icon if needed
        altText: "",
        message: "",
      };
    }
  };

  const emptyState = getEmptyState();

  return (
    <Card
      className={clsx(
        "w-full h-[340px] border-none custom-flex-col overflow-hidden",
        className
      )}
      style={{
        boxShadow:
          "0px 1px 2px 0px rgba(21, 30, 43, 0.08), 0px 2px 4px 0px rgba(13, 23, 33, 0.08)",
      }}
    >
      <CardHeader className="p-4 pb-[10px] sticky top-0 bg-[inherit] z-[2]">
        <CardTitle className="flex items-center justify-between text-[16px]">
          <p className="text-black font-medium dark:text-[#f1f1fd]">
            {sectionHeader}
          </p>
          {seeAllLink && (
            <Link
              href={seeAllLink}
              className={clsx(
                "flex items-center font-medium",
                notifications.length === 0
                  ? "text-[#C1C2C3]"
                  : "text-[#4F5E71] dark:text-[#f1f1fd]"
              )}
            >
              See all
              <ChevronRight className="w-5 h-5" />
            </Link>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent
        className={clsx(
          "custom-flex-col gap-4 p-4 pt-0 flex-1 overflow-auto no-scrollbar",
          {
            "py-[55px] px-[40px]": notifications.length === 0,
          }
        )}
      >
        {notifications.map((notification, index) => (
          <div key={index} className="flex items-center justify-between">
            <Link
              href={
                sectionHeader === "Staffs"
                  ? `/management/staff-branch/${branchId}/branch-staff/${notification.staff_ID}`
                  : "#"
              }
              className="flex items-center gap-3 w-[70%]"
            >
              <div className="custom-secondary-bg rounded-full p-[1px]">
                <Picture
                  src={notification.avatarSrc || empty}
                  alt="profile picture"
                  size={36}
                  rounded
                />
              </div>
              <div className="w-full gap-1">
                {/* <div className=""> */}
                <p className="text-sm font-medium text-text-primary dark:text-[#f1f1fd] flex items-center line-clamp-1 text-ellipsis">
                  {notification.name}
                  {sectionHeader !== "Staffs" && (
                    <BadgeIcon color={notification.badgeColor || "red"} />
                  )}
                </p>
                {/* <p className="text-[10px] text-text-disabled">
                  {sectionHeader === "Staffs" ? "Message" : notification.time}
                </p> */}
                {/* </div> */}
                {notification.title && (
                  <p className="line-clamp-1 text-ellipsis text-xs text-text-secondary capitalize dark:text-text-disabled">
                    {notification.title === "manager"
                      ? "Branch Manager"
                      : notification.title}
                  </p>
                )}
                <p className="text-xs text-text-tertiary font-normal capitalize">
                  {sectionHeader !== "Staffs"
                    ? notification.message
                    : notification.position === "manager"
                      ? "Branch Manager"
                      : notification.position}
                </p>
              </div>
            </Link>
            {sectionHeader === "Staffs" ? (
              <Link href={`/messages/${notification.user_id}`}>
                <p className="text-[10px] text-text-disabled">
                  Message
                </p>
              </Link>
            ) : (
              <div>
                <p className="text-[10px] text-text-disabled">
                  {notification.time}
                </p>
              </div>
            )}
          </div>
        ))}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center text-center gap-6">
            {emptyState.icon && (
              <Image
                alt={emptyState.altText}
                src={emptyState.icon}
                width={60}
                height={60}
              />
            )}
            <p className="font-normal text-xs text-brand-9">
              {emptyState.message}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
