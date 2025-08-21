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

type Conversation = {
  unread_count: number;
  [key: string]: any;
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
    channel.listen(".message.received", (data: any) => {
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

    notification.listen(".new.notification", (data: any) => {
      console.log("notifications", { data });
    });

    channel.listen(".conversation.updated", (data: any) => {
      const unread_count = getUnreadSummary(data);
      setPersonalInfo("unread_messages_count", unread_count);
      console.log("updated", { data });
    });

    channel.listen(
      ".conversation.created",
      (data: ConversationsUpdatedReturn) => {
        const event = new CustomEvent("refetch-users-msg", {
          detail: data,
        });
        window.dispatchEvent(event);
      }
    );

    return () => {
      channel.stopListening(".message.received");
      channel.stopListening(".conversation.created");
    };
  }, [echo, isConnected, addNotification, params, pathname]);

  return null;
}
