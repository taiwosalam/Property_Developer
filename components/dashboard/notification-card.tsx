import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import React from "react";
import Image from "next/image";
import clsx from "clsx";
import { notificationCardProps } from "./types";
import messagesIcon from "@/public/icons/message.svg";
import complaintsIcon from "@/public/icons/complaints.svg";
import verified from "@/public/icons/verified.svg";
import Link from "next/link";

const NotificationCard: React.FC<notificationCardProps> = ({
  sectionHeader,
  notifications,
  branchId,
}) => {
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
    <Card className="w-full border-none shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[16px]">
          <p className="font-medium">{sectionHeader}</p>
          <p
            className={clsx(
              "flex items-center font-medium",
              notifications.length === 0 ? "text-[#C1C2C3]" : "text-[#4F5E71]"
            )}
          >
            See all
            <ChevronRight className="w-5 h-5" />
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent
        className={clsx("grid gap-8", {
          "py-[55px] px-[40px]": notifications.length === 0,
        })}
      >
        {notifications.map((notification, index) => (
          <Link href={sectionHeader === "Staffs" ? `/management/staff-branch/${branchId}/${notification.staff_ID}/staff-profile` : "#"} className="flex items-center gap-3" key={index}>
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={notification.avatarSrc} alt="Avatar" />
              <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="w-full gap-1">
              <div className="w-full flex items-center justify-between">
                <p className="text-sm font-medium text-text-primary flex items-center">
                  {notification.name || notification.full_name}
                  {sectionHeader !== "Staffs" && (
                    <Image
                      src={verified}
                      alt="badge"
                      width={14}
                      height={14}
                      style={{
                        width: "14px",
                        height: "14px",
                      }}
                      className="ml-1"
                    />
                  )}
                </p>
                <p className="text-[10px] text-text-disabled">
                  {sectionHeader === "Staffs" ? "Message" : notification.time}
                </p>
              </div>
              {notification.title != "Staffs" && (
                <p className="text-xs text-text-secondary capitalize">
                  {notification.title}
                </p>
              )}
              <p className="text-xs text-text-tertiary font-normal">
                {notification.title === "Message" ? `${notification.message.trim().slice(0, 35)}...` : notification.position}
              </p>
            </div>
          </Link>
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
