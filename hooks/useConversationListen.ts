import { useEffect, useRef } from "react";
import { initializeEcho } from "@/lib/echo";
import { getLocalStorage } from "@/utils/local-storage";

interface Message {
  id: number;
  text: string | null;
  senderId: number;
  timestamp: string;
  content_type: string;
}

export default function useConversationListener(
  participantId: string,
  onMessage: (message: Message) => void,
  onError?: (error: any) => void
) {
  if (typeof window === "undefined") return;

  const echoRef = useRef<any>(null);

  useEffect(() => {
    const currentUserId = getLocalStorage("user_id");
    if (!currentUserId || !participantId) {
      console.log("useConversationListener skipped:", {
        currentUserId,
        participantId,
      });
      return;
    }

    const channelName = `user.${currentUserId}`; // Use user.{userId} as per backend

    const echo = initializeEcho();
    if (!echo) {
      console.error("Failed to initialize Echo for subscription");
      onError?.("Failed to initialize Echo");
      return;
    }

    echoRef.current = echo;
    console.log("Subscribing to channel:", channelName);
    const channel = echo.private(channelName);

    // Listen for the correct backend event
    channel.listen(
      ".participant.messages.retrieved",
      (event: {
        messages: Array<{
          id: number;
          content: string;
          sender_id: number;
          date: string;
          timestamp: string;
          content_type: string;
        }>;
      }) => {
        console.log("🔔 New messages received on", channelName, ":", event);
        // Assuming event.messages is an array of messages
        event.messages.forEach((msg) => {
          const newMessage: Message = {
            id: msg.id,
            text: msg.content ?? null,
            senderId: msg.sender_id,
            timestamp: `${msg.date} ${msg.timestamp}`,
            content_type: msg.content_type,
          };
          onMessage(newMessage);
        });
      }
    );

    // Error handling
    channel.error((error: any) => {
      console.error("Pusher subscription error:", error);
      onError?.(error);
    });

    // Log subscription status
    channel.subscribed(() => {
      console.log("✅ Successfully subscribed to", channelName);
    });

    return () => {
      if (echoRef.current) {
        console.log("Stopping listener for", channelName);
        echoRef.current.leave(channelName);
        echoRef.current = null;
      }
    };
  }, [participantId, onMessage, onError]);
}

