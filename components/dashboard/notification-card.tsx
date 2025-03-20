"use client";
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
import {
  getIconByContentType,
  roundUptoNine,
} from "@/app/(nav)/(messages-reviews)/messages/data";

const NotificationCard: React.FC<notificationCardProps> = ({
  sectionHeader,
  notifications,
  branchId,
  className,
  seeAllLink,
}) => {

  console.log("Notifications: ", notifications);
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
    } else if (sectionHeader === "Staffs") {
      return {
        icon: complaintsIcon, // Add appropriate icon if available
        altText: "Staff Icon",
        message: "You haven't created any staff accounts yet. To add a staff member, click the \"Create New Staff\" button. Once created, their login details will be sent to them, allowing them to access their company dashboard using the credentials assigned. \nThey will only have access to the permissions you grant them. Once you add staff profiles, this guide will no longer be visible. To revisit this guide later, click your profile picture at the top right of the dashboard and select Assistance & Support.",
      };
    } else {
      return { icon: "", altText: "", message: "" };
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
        {notifications.map((notification, index) => {
          const IconComponent = getIconByContentType(
            notification.content_type as string
          );

          return (
            <div key={index} className="flex items-center justify-between">
              <Link
                href={
                  sectionHeader === "Staffs"
                    ? `/management/staff-branch/${branchId}/branch-staff/${notification.staff_ID}`
                    : sectionHeader === "Recent Messages"
                    ? `/messages/${notification.id}`
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
                  <p className="text-sm font-medium text-text-primary dark:text-[#f1f1fd] flex items-center line-clamp-1 text-ellipsis">
                    {notification.name}
                    {/* {sectionHeader !== "Staffs" && (
                      <BadgeIcon color={notification.badgeColor || "red"} />
                    )} */}
                  </p>
                  {notification.position && (
                    <p className="line-clamp-1 text-ellipsis text-xs text-text-secondary capitalize dark:text-text-disabled">
                      {notification.position === "manager"
                        ? "Branch Manager"
                        : notification.position}
                    </p>
                  )}
                  <p className="text-xs text-text-tertiary font-normal capitalize">
                    {notification.content_type === "text" ? (
                      sectionHeader !== "Staffs" ? (
                        notification.message
                      ) : notification.position === "manager" ? (
                        "Branch Manager"
                      ) : (
                        notification.position
                      )
                    ) : (
                      <div className="flex gap-1 items-center">
                        {IconComponent && <IconComponent />}
                        {notification.content_type}
                      </div>
                    )}
                  </p>
                </div>
              </Link>
              {sectionHeader === "Staffs" ? (
                <Link href={`/messages/${notification.user_id}`}>
                  <p className="text-[10px] text-text-disabled">Message</p>
                </Link>
              ) : (
                <div className="custom-flex-col items-center">
                  <p className="text-[10px] text-text-disabled">
                    {notification.time}
                  </p>
                  {notification.count !== undefined && (
                    <div className="bg-brand-9 inline-flex items-center justify-center py-1 rounded-full whitespace-nowrap">
                      <p className="text-white text-[10px] font-medium">
                        {roundUptoNine(notification.count)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
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
