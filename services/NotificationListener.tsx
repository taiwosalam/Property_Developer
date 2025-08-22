// components/NotificationListener.tsx
"use client";
import React, { useEffect } from "react";
import { useNotificationStore } from "@/store/notification-store";
import { v4 as uuid } from "uuid";
import { useEcho } from "@/lib/echo";
import {
  getFinalContentType,
  transformMessageFromAPI,
} from "@/app/(nav)/(messages-reviews)/messages/data";
import { useParams, usePathname } from "next/navigation";
import { ConversationsUpdatedReturn } from "@/app/(nav)/(messages-reviews)/messages/types";
import useFetch from "@/hooks/useFetch";
import { ProfileResponse } from "@/lib/profile";
import { usePersonalInfoStore } from "@/store/personal-info-store";
import { useRole } from "@/hooks/roleContext";
import {
  clearAllNotification,
  extractNotificationType,
  fetchNotifications,
} from "@/app/(nav)/notifications/data";
import { hasNotificationPermission } from "@/components/Notification/notification-permission";

type Conversation = {
  unread_count: number;
  [key: string]: any;
};

type Notification = {
  id: number;
  message: string;
  sender_name: string;
  sender_picture: string;
  source: string;
  title: string;
  type: string;
};

type MessageEventGroup = {
  sender_id: number;
  group_chat_id: number;
  message: {
    id: number;
    group_chat_id: number;
    sender: {
      id: number;
      name: string;
      avatar: string;
      role: string;
    };
    content: string;
    content_type: string;
    reply_to: number | null;
    reactions: any[]; // You can make this more specific if you know the reaction structure
    read_receipts: any[]; // Same here
    created_at: string;
    updated_at: string;
  };
  event_type: string;
  timestamp: string;
};

type ConversationPayload = {
  conversation_count: number;
  conversation_data: Conversation[];
};

function getUnreadSummary(payload: ConversationPayload) {
  // Count how many conversations have unread > 0
  const totalUnreadSources = payload.conversation_data.reduce(
    (sum, convo) => sum + ((convo.unread_count || 0) > 0 ? 1 : 0),
    0
  );
  return totalUnreadSources;
}

export default function NotificationListener() {
  const { role } = useRole();

  const setPersonalInfo = usePersonalInfoStore(
    (state) => state.setPersonalInfo
  );
  const { echo, isConnected } = useEcho();
  const addNotification = useNotificationStore((s) => s.addNotification);

  const params = useParams();
  const pathname = usePathname();

  useEffect(() => {
    if (!echo || !isConnected) return;

    const token = window.localStorage.getItem("user_id");
    if (!token) return;

    const channel = echo.private(`user.${token}`);
    const notification = echo.private(`notifications.${token}`);
    // const event = new CustomEvent("refetch-users-msg", {
    //   detail: "",
    // });

    // window.dispatchEvent(event);
    channel.listen(".message.received", (data: any) => {
      const event = new CustomEvent("refetch-users-msg", {
        detail: data,
      });
      window.dispatchEvent(event);
      console.log("data received", { data });
      const cleanedMessage = transformMessageFromAPI(data, false);
      const currentChatId = params?.id ? Number(params.id) : null;
      const onMessagesPage = pathname.startsWith("/messages/");
      if (onMessagesPage && currentChatId === data.sender_id) {
        return; // don't show notification if user is already in the chat
      }
      const finalContent = getFinalContentType({
        latest_message_type: data.message.type,
        latest_message: data.message.content,
      });
      addNotification({
        id: uuid(),
        type: "message",
        content_type: finalContent,
        role: data.message.role,
        chatId: data.chat_id,
        message: cleanedMessage.text as string,
        senderId: data.sender_id,
        senderName: data.message.sender_name,
        senderTier: data.message.sender_tier ?? data.sender?.tier_id, // adjust if nested
        senderImage: data.message.sender_profile_picture,
        createdAt: data.created_at,
      });
    });
    channel.listen(".message.sent", (data: any) => {
      const event = new CustomEvent("refetch-users-msg", {
        detail: data,
      });
      window.dispatchEvent(event);
    });
    channel.listen("chat.sent", (data: any) => {
      const event = new CustomEvent("refetch-users-msg", {
        detail: data,
      });
      window.dispatchEvent(event);
    });
    notification.listen(".new.notification", (data: Notification) => {
      const send = hasNotificationPermission(role as "manager", data.type);
      if (send)
        addNotification({
          id: String(data.id),
          type: extractNotificationType(data.type) as "message",
          content_type: "text",
          role: "",
          chatId: 4,
          message: data.message,
          senderId: data.id,
          senderName: data.message,
          senderTier: 0, // adjust if nested
          senderImage: data.sender_picture,
          createdAt: "5656677",
        });
      window.dispatchEvent(new CustomEvent("refetchNotifications"));
    });

    notification.listen(".chat.sent", (data: MessageEventGroup) => {
      const finalContent = getFinalContentType({
        latest_message_type: data.message.content_type,
        latest_message: data.message.content,
      });
      // if (send)
      addNotification({
        id: uuid(),
        type: "message",
        content_type: finalContent,
        role: data.message.sender.name,
        chatId: 4,
        message: data.message.content,
        senderId: data.message.sender.id,
        senderName: data.message.sender.name,
        senderTier: 0, // adjust if nested
        senderImage: data.message.sender.avatar,
        createdAt: "5656677",
      });
      window.dispatchEvent(new CustomEvent("refetchNotifications"));
    });

    channel.listen(".conversation.updated", (data: any) => {
      const unread_count = getUnreadSummary(data);

      setPersonalInfo("unread_messages_count", unread_count);
      console.log("updated", { data });
    });

    // channel.listen(
    //   ".conversation.created",
    //   (data: ConversationsUpdatedReturn) => {
    //     const event = new CustomEvent("refetch-users-msg", {
    //       detail: data,
    //     });
    //     window.dispatchEvent(event);
    //   }
    // );

    return () => {
      channel.stopListening(".message.received");
      channel.stopListening(".conversation.created");
    };
  }, [echo, isConnected, addNotification, params, pathname]);

  return null;
}
