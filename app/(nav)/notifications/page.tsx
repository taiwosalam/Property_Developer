"use client";
import React, { useEffect, useState } from "react";

// Imports
import Notification from "@/components/Notification/notification";
import { SectionSeparator } from "@/components/Section/section-components";
import useFetch from "@/hooks/useFetch";
import {
  clearAllNotification,
  deleteAllNotification,
  NotificationApiResponse,
  TNotificationData,
  transformNotificationData,
} from "./data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import ServerError from "@/components/Error/ServerError";
import { toast } from "sonner";

const Notifications = () => {
  const [notifications, setNotifications] = useState<TNotificationData | null>(
    null
  );
  const [notificationIds, setNotificationIds] = useState<string[]>([]);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);
  const {
    data: apiData,
    silentLoading,
    error,
    refetch,
  } = useFetch<NotificationApiResponse>(`/notifications`);
  useRefetchOnEvent("refetchNotifications", () => refetch({ silent: true }));

  console.log(notifications?.notifications.length, "From the abyss");

  useEffect(() => {
    if (apiData) {
      const transformedData = transformNotificationData(apiData);
      setNotifications(transformedData);
      const ids = apiData.data.length
        ? apiData?.data?.map((item) => item.id)
        : [];
      setNotificationIds(ids);
    }
  }, [apiData]);

  const handleDeleteNotifications = async () => {
    if (!notificationIds.length) return;

    try {
      setIsClearingNotifications(true);
      const res = await deleteAllNotification(notificationIds);
      if (res) {
        toast.success("Notifications Cleared");
      }
    } catch (error) {
      //console.error(error);
    } finally {
      setIsClearingNotifications(false);
    }
  };

  if (error) return <ServerError error={error} />;

  return (
    <div
      className="space-y-8 overflow-auto custom-round-scrollbar pr-2"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <div className="space-y-3 sticky top-0 bg-neutral-2 dark:bg-[#000000] z-[1]">
        <div className="flex items-center justify-between gap-4 text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
          <h1>Notifications</h1>
          {apiData && apiData?.data.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteNotifications}
              disabled={isClearingNotifications}
              className={`text-base ml-3 ${
                isClearingNotifications
                  ? "text-slate-400 dark:text-slate-300"
                  : ""
              }`}
            >
              {isClearingNotifications ? "Please wait..." : "Clear all"}
            </button>
          )}
        </div>
        <SectionSeparator />
      </div>
      <div className="custom-flex-col gap-6">
        {notifications && !notifications?.notifications.length && (
          <p>You currently have no new notification at this time</p>
        )}
        {notifications &&
          notifications.notifications.length > 0 &&
          notifications.notifications.map((notification, index) => (
            <Notification key={index} notification={notification} />
          ))}
      </div>
    </div>
  );
};

export default Notifications;
