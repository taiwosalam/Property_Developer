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
  onError?: (error: any) => void // Add optional error callback
) {
  const echoRef = useRef<any>(null);

  useEffect(() => {
    const currentUserId = getLocalStorage("user_id");
    // console.log("useConversationListener:", { currentUserId, participantId });

    if (!currentUserId || !participantId) {
      console.log("useConversationListener skipped:", {
        currentUserId,
        participantId,
      });
      return;
    }

    const [minId, maxId] = [Number(currentUserId), Number(participantId)].sort(
      (a, b) => a - b
    );
    const channelName = `conversation.${minId}.${maxId}`;
    const altChannelName = `conversation-${minId}-${maxId}`; 

    const echo = initializeEcho();
    if (!echo) {
      console.error("Failed to initialize Echo for subscription");
      onError?.("Failed to initialize Echo");
      return;
    }

    echoRef.current = echo;
    console.log("Subscribing to channel:", channelName);
    const channel = echo.private(channelName);

    // Main event
    channel.listen(
      ".new_message",
      (event: {
        id: number;
        content: string;
        sender_id: number;
        date: string;
        timestamp: string;
        content_type: string;
      }) => {
        console.log("🔔 New message received on", channelName, ":", event);
        const newMessage: Message = {
          id: event.id,
          text: event.content ?? null,
          senderId: event.sender_id,
          timestamp: `${event.date} ${event.timestamp}`,
          content_type: event.content_type,
        };
        onMessage(newMessage);
      }
    );

    // Debug alternative event
    channel.listen(
      ".messages.new",
      (event: {
        id: number;
        content: string;
        sender_id: number;
        date: string;
        timestamp: string;
        content_type: string;
      }) => {
        console.log(
          "🔔 Alternative event received on",
          channelName,
          ":",
          event
        );
        const newMessage: Message = {
          id: event.id,
          text: event.content ?? null,
          senderId: event.sender_id,
          timestamp: `${event.date} ${event.timestamp}`,
          content_type: event.content_type,
        };
        onMessage(newMessage);
      }
    );

    // Debug alternative channel
    const altChannel = echo.private(altChannelName);
    altChannel.listen(
      ".new_message",
      (event: {
        id: number;
        content: string;
        sender_id: number;
        date: string;
        timestamp: string;
        content_type: string;
      }) => {
        console.log("🔔 New message received on", altChannelName, ":", event);
        const newMessage: Message = {
          id: event.id,
          text: event.content ?? null,
          senderId: event.sender_id,
          timestamp: `${event.date} ${event.timestamp}`,
          content_type: event.content_type,
        };
        onMessage(newMessage);
      }
    );

    // Error handling for both channels
    channel.error((error: any) => {
      console.error("Pusher subscription error:", error);
      onError?.(error);
    });

    altChannel.error((error: any) => {
      console.error("Pusher subscription error (alt channel):", error);
      onError?.(error);
    });

    // Log binding status
    channel.subscribed(() => {
      console.log("✅ Successfully subscribed to", channelName);
    });

    return () => {
      if (echoRef.current) {
        console.log("Stopping listener for", channelName);
        echoRef.current.leave(channelName);
        echoRef.current.leave(altChannelName);
        echoRef.current = null;
      }
    };
  }, [participantId, onMessage, onError]);
}
