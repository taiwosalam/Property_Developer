// app/hooks/useGetConversationWithPusher.ts
import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/message";
import { useAuthStore } from "@/store/authStore";
import Pusher from "pusher-js";
import api from "@/services/api";
import { getLocalStorage } from "@/utils/local-storage";

interface Message {
  id: number;
  text: string | null;
  senderId: number;
  timestamp: string;
  content_type: string;
}

const useGetConversationWithPusher = (id: string) => {
  const { data, setChatData } = useChatStore();
  const token = useAuthStore((state) => state.token);
  const currentUserId =
    useAuthStore((state) => state.user_id) || getLocalStorage("user_id");

  const participantId = Number(id);
  const [minId, maxId] = [Number(currentUserId), participantId].sort(
    (a, b) => a - b
  );
  const channelName = `private-conversation-${minId}-${maxId}`;

  const pusherRef = useRef<Pusher | null>(null);
  const conversationsRef = useRef<Message[]>(data.conversations || []);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  useEffect(() => {
    conversationsRef.current = data.conversations || [];
  }, [data.conversations]);

  const setupPusher = () => {
    if (!currentUserId || !token) {
      console.log("Skipping Pusher init: missing user_id or token", {
        currentUserId,
        token: token ? "present" : "missing",
      });
      return null;
    }

    if (!pusherRef.current) {
      pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
        authEndpoint: "/api/broadcasting/auth",
        auth: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
      console.log("Pusher initialized:", {
        channelName,
        currentUserId,
        participantId,
        token: "present",
      });
    }
    return pusherRef.current;
  };

  useEffect(() => {
    const pusher = setupPusher();
    if (!pusher) return;

    console.log("Subscribing to channel:", channelName);
    const channel = pusher.subscribe(channelName);

    channel.bind("pusher:subscription_succeeded", () => {
      console.log("Subscription succeeded for:", channelName);
      retryCountRef.current = 0;
    });

    channel.bind("pusher:subscription_error", (error: any) => {
      console.error("Subscription error for", channelName, ":", error);
      if (retryCountRef.current < maxRetries) {
        console.log(
          `Retrying subscription (${retryCountRef.current + 1}/${maxRetries})`
        );
        retryCountRef.current += 1;
        setTimeout(() => {
          pusher.unsubscribe(channelName);
          pusher.subscribe(channelName);
        }, 2000);
      } else {
        console.error("Max retries reached for", channelName);
      }
    });

    channel.bind("new_message", (eventData: any) => {
      console.log("Received new_message on", channelName, ":", eventData);
      const newMessage: Message = {
        id: eventData.id,
        text: eventData.content ?? null,
        senderId: eventData.sender_id,
        timestamp: `${eventData.date} ${eventData.timestamp}`,
        content_type: eventData.content_type,
      };

      const updatedConversations = [
        ...conversationsRef.current,
        newMessage,
      ].sort((a, b) => a.id - b.id);
      console.log("Updating conversations:", updatedConversations);
      setChatData("conversations", updatedConversations);
      conversationsRef.current = updatedConversations;
    });

    return () => {
      console.log("Unsubscribing from:", channelName);
      channel.unbind_all();
      pusher?.unsubscribe(channelName);
    };
  }, [channelName, currentUserId, token, setChatData]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/conversations/user/${id}`);
        console.log("API response:", response.data);
        if (response.data.status === "success") {
          const mappedMessages: Message[] = response.data.messages.map(
            (msg: any) => ({
              id: msg.id,
              text: msg.content ?? null,
              senderId: msg.sender_id,
              timestamp: `${msg.date} ${msg.timestamp}`,
              content_type: msg.content_type,
            })
          );
          console.log("Mapped messages:", mappedMessages);
          setChatData("conversations", mappedMessages);
          conversationsRef.current = mappedMessages;
        }
      } catch (error: any) {
        console.error("API error:", error.response?.data || error.message);
      }
    };
    if (id && token) fetchMessages();
  }, [id, token, setChatData]);

  useEffect(() => {
    return () => {
      if (pusherRef.current) {
        console.log("Disconnecting Pusher");
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, []);

  return null;
};

export default useGetConversationWithPusher;
