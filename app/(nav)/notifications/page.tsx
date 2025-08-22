"use client";
import React, { useEffect, useState } from "react";

// Imports
import Notification from "@/components/Notification/notification";
import { SectionSeparator } from "@/components/Section/section-components";
import useFetch from "@/hooks/useFetch";
import {
  clearAllNotification,
  deleteAllNotification,
  fetchNotifications,
  NotificationApiResponse,
  TNotificationData,
  transformNotificationData,
} from "./data";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";
import ServerError from "@/components/Error/ServerError";
import { toast } from "sonner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Loader2 } from "lucide-react";
import EmptyList from "@/components/EmptyList/Empty-List";
import NotificationsSkeleton from "./notification-skeleton";
import {
  filterNotificationsByRole,
  UserRole,
} from "@/components/Notification/notification-permission";
import { useRole } from "@/hooks/roleContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState<
    TNotificationData["notifications"]
  >([]);
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<TNotificationData["meta"]>();
  const [initialLoading, setInitialLoading] = useState(true);
  const [notificationIds, setNotificationIds] = useState<string[]>([]);
  const [isClearingNotifications, setIsClearingNotifications] = useState(false);

  // Get user role from context
  const { role } = useRole();

  const loadMore = async () => {
    const data = await fetchNotifications(page + 1);
    if (data) {
      // Filter notifications based on role permissions
      const filteredNotifications = role
        ? filterNotificationsByRole(data.notifications, role as UserRole)
        : data.notifications;
      setNotifications((prev) => [...prev, ...filteredNotifications]);
      setMeta(data.meta);
      setPage((prev) => prev + 1);
    }
  };
  const { isLoading, lastElementRef } = useInfiniteScroll({
    callback: loadMore,
    hasMore: page < (meta?.last_page || 1),
  });

  const refetchNotifications = async () => {
    const data = await fetchNotifications(1);
    if (data) {
      // Filter notifications based on role permissions
      const filteredNotifications = role
        ? filterNotificationsByRole(data.notifications, role as UserRole)
        : data.notifications;
      setNotifications(filteredNotifications);
      setMeta(data.meta);
      setPage(1);
    }
  };

  // Listen for the custom refetch event
  useEffect(() => {
    const handleRefetch = () => {
      refetchNotifications();
    };

    window.addEventListener("refetchNotifications", handleRefetch);
    return () => {
      window.removeEventListener("refetchNotifications", handleRefetch);
    };
  }, [role]); // Add role as dependency

  useEffect(() => {
    const loadInitial = async () => {
      setInitialLoading(true);
      const data = await fetchNotifications(1);
      console.log("notifications", { data });
      if (data) {
        // Filter notifications based on role permissions
        const filteredNotifications = role
          ? filterNotificationsByRole(data.notifications, role as UserRole)
          : data.notifications;
        setNotifications(filteredNotifications);
        setMeta(data.meta);
      }
      setInitialLoading(false);
    };
    loadInitial();
  }, [role]); // Add role as dependency

  const handleDeleteNotifications = async () => {
    try {
      setIsClearingNotifications(true);
      const res = await deleteAllNotification();
      if (res) {
        toast.success("Notifications Cleared");
      }
    } catch (error) {
      //console.error(error);
    } finally {
      setIsClearingNotifications(false);
    }
  };

  return (
    <div
      className="space-y-8 overflow-auto custom-round-scrollbar pr-2"
      style={{ height: "calc(100vh - 200px)" }}
    >
      <div className="space-y-3 sticky top-0 bg-neutral-2 dark:bg-[#000000] z-[1]">
        <div className="flex items-center justify-between gap-4 text-black dark:text-white text-lg md:text-xl lg:text-2xl font-medium">
          <h1>Notifications</h1>
          {!initialLoading && notifications?.length > 0 && (
            <button
              type="button"
              onClick={handleDeleteNotifications}
              disabled={isClearingNotifications}
              className={`text-base ml-3 px-4 font-semibold hover:opacity-70 ${
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
        {initialLoading ? (
          <NotificationsSkeleton />
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification, index) => {
            if (index === notifications.length - 1) {
              return (
                <div key={notification.id} ref={lastElementRef}>
                  <Notification notification={notification} />
                </div>
              );
            }
            return (
              <Notification key={notification.id} notification={notification} />
            );
          })
        ) : (
          <EmptyList
            noButton
            title="No Notifications Yet"
            body={
              <p>
                You have no new notifications at the moment. Stay tuned;
                updates, alerts, and important information will appear here as
                soon as they&apos;re available.
              </p>
            }
          />
        )}

        {isLoading && (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-brand-9" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
