import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import React from "react";
import { notificationCardProps } from "./types";

const NotificationCard: React.FC<notificationCardProps> = ({
  sectionHeader,
  notifications,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-[16px]">
          <p className="font-medium">{sectionHeader}</p>
          <p className="text-[#4F5E71] flex items-center">
            See all
            <ChevronRight className="w-5 h-5" />
          </p>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        {notifications.map((notification, index) => (
          <div className="flex items-center gap-3" key={index}>
            <Avatar className="hidden h-9 w-9 sm:flex">
              <AvatarImage src={notification.avatarSrc} alt="Avatar" />
              <AvatarFallback>{notification.avatarFallback}</AvatarFallback>
            </Avatar>
            <div className="w-full gap-1">
              <div className="w-full flex items-center justify-between">
                <p className="text-sm font-medium text-text-primary">
                  {notification.name}
                </p>
                <p className="text-[10px] text-text-disabled">
                  {notification.time}
                </p>
              </div>
              {notification.title && (
                <p className="text-xs text-text-secondary capitalize">
                  {notification.title}
                </p>
              )}
              <p className="text-xs text-text-tertiary font-normal">
                {notification.message.trim().slice(0, 35)}...
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
