"use client";
import clsx from "clsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import { notificationCardProps } from "./types";
import messagesIcon from "@/public/icons/message.svg";
import complaintsIcon from "@/public/icons/complains.svg";
import BadgeIcon from "../BadgeIcon/badge-icon";
import { empty } from "@/app/config";
import Link from "next/link";
import Picture from "../Picture/picture";
import {
  getIconByContentType,
  roundUptoNine,
} from "@/app/(nav)/(messages-reviews)/messages/data";
import {
  ComplainsEmptyIcon,
  EmptyMessageIcon,
  EmptyStaffIcon,
} from "@/public/icons/icons";
import { useGlobalStore } from "@/store/general-store";
import { useRouter } from "next/navigation";
import { capitalizeWords } from "@/hooks/capitalize-words";
import { useRole } from "@/hooks/roleContext";
import { complaintsData } from "@/app/(nav)/dashboard/data";

const NotificationCard: React.FC<notificationCardProps> = ({
  sectionHeader,
  notifications,
  branchId,
  className,
  seeAllLink,
}) => {
  const router = useRouter();
  const setGlobalStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const { role } = useRole();

  const getStaffsPageLink = (branchId: string, staffId: string) => {
    switch (role) {
      case "director":
        return `/management/staff-branch/${branchId}/branch-staff/${staffId}`;
      case "manager":
        return `/manager/management/branch-staff/${staffId}`;
      case "account":
        return `/accountant/management/branch-staff/${staffId}`;
      default:
        return `/unauthorized`;
    }
  };

  const handleUserClicked = (user: any) => {
    try {
      const newMessageUserData = {
        branch_id: Number(user.branch_id) || 0,
        id: Number(user.id),
        imageUrl: user.imageUrl || "",
        name: user.name,
        position: user.position || "",
        staff_id: user.staff_id || user.id,
      };

      // Update global store with new user data
      setGlobalStore("messageUserData", newMessageUserData);
      router.push(`/messages/${user.id}`);
    } catch (error) {
      console.error("Failed to navigate to messages:", error);
    }
  };

  const getEmptyState = () => {
    if (sectionHeader === "Recent Messages") {
      return {
        icon: <EmptyMessageIcon size={60} />,
        altText: "Messages Icon",
        message:
          "You do not have any recent messages. You can chat with staff, landlord/landlady, tenants, and occupants.",
      };
    } else if (sectionHeader === "Recent Complaints") {
      return {
        icon: <ComplainsEmptyIcon />,
        altText: "Complaints Icon",
        message:
          "You currently have no complaints from your tenants or occupants. Any submitted complaints will be displayed here.",
      };
    } else if (sectionHeader === "Staffs") {
      return {
        icon: <EmptyStaffIcon size={60} />, // Add appropriate icon if available
        altText: "Staff Icon",
        message:
          "No Staff has been created for this branch yet. Once added, they will appear here.",
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
              href={notifications?.length === 0 ? "#" : seeAllLink}
              className={clsx(
                "flex items-center font-medium",
                notifications?.length === 0
                  ? "text-[#C1C2C3] cursor-not-allowed"
                  : "text-[#4F5E71] dark:text-[#f1f1fd]"
              )}
              onClick={(e) => {
                if (notifications?.length === 0) {
                  e.preventDefault();
                }
              }}
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
            "py-[55px] px-[40px]": notifications?.length === 0,
          }
        )}
      >
        {notifications?.map((notification, index) => {
          const IconComponent = getIconByContentType(
            notification.content_type as string
          );

          return (
            <div key={index} className="flex items-center justify-between">
              <Link
                href={
                  sectionHeader === "Staffs"
                    ? getStaffsPageLink(
                        branchId || "0",
                        notification.staff_ID || "0"
                      )
                    : sectionHeader === "Recent Messages"
                    ? `/messages/${notification.id}`
                    : sectionHeader === "Recent Complaints" && seeAllLink
                    ? seeAllLink
                    : "#"
                }
                className="flex items-center gap-3 w-[70%]"
              >
                <div className="custom-secondary-bg rounded-full p-[1px]">
                  <Picture
                    src={notification.avatarSrc || empty}
                    alt="profile picture"
                    status={notification.online}
                    size={36}
                    rounded
                  />
                </div>
                <div className="w-full gap-1">
                  <div className="flex items-center gap-1 text-sm font-medium text-text-primary dark:text-[#f1f1fd] line-clamp-1 text-ellipsis">
                    <span className="truncate capitalize">
                      {capitalizeWords(notification.name)}
                    </span>
                    {notification.badgeColor && (
                      <BadgeIcon color={notification.badgeColor} />
                    )}
                  </div>

                  {sectionHeader === "Staffs"
                    ? notification.position && (
                        <p className="line-clamp-1 text-ellipsis text-xs text-text-secondary capitalize dark:text-text-disabled">
                          {notification.position === "manager"
                            ? "Branch Manager"
                            : notification.position}
                        </p>
                      )
                    : notification.title && (
                        <p className="line-clamp-1 text-ellipsis text-xs text-text-secondary capitalize dark:text-text-disabled">
                          {notification.title}
                        </p>
                      )}

                  {sectionHeader === "Recent Complaints" && (
                    <p className="line-clamp-2 text-ellipsis text-xs text-text-secondary capitalize dark:text-text-disabled">
                      {notification.message} {notification.badgeColor}
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
                <button
                  onClick={() =>
                    handleUserClicked({
                      id: notification.user_id,
                      branch_id: branchId,
                      imageUrl: notification.avatarSrc,
                      name: notification.name,
                      position: notification.position,
                      staff_id: notification.staff_ID,
                    })
                  }
                  className="text-[10px] text-text-disabled hover:text-brand-9"
                >
                  Message
                </button>
              ) : (
                <div className="custom-flex-col items-center">
                  <p className="text-[10px] text-text-disabled">
                    {notification.time}
                  </p>
                  {notification.count !== undefined && (
                    <div className="ml-auto bg-brand-9 inline-flex items-center justify-center min-w-[30px] h-[20px] px-1 rounded-full whitespace-nowrap">
                      <p className="text-white text-[10px] font-medium text-center">
                        {roundUptoNine(notification.count)}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {notifications?.length === 0 && (
          <div className="flex flex-col items-center text-center gap-6">
            {emptyState.icon && (
              <div className="text-brand-9">{emptyState.icon}</div>
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
