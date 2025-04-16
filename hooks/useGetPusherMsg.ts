import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/message";
import { useAuthStore } from "@/store/authStore";
import Pusher from "pusher-js";
import api from "@/services/api";

interface Message {
  id: number;
  text: string;
  senderId: number;
  timestamp: string;
  content_type: string;
}

const useGetConversationWithPusher = (id: string) => {
  const { data, setChatData } = useChatStore();
  const token = useAuthStore((state) => state.token);
  const currentUserId = useAuthStore((state) => state.user_id);

  const [minId, maxId] = [currentUserId, Number(id)].sort((a, b) => a - b);
  const channelName = `private-conversation-${minId}-${maxId}`;

  const pusherRef = useRef<Pusher | null>(null);
  const conversationsRef = useRef<Message[]>(data.conversations || []);

  useEffect(() => {
    conversationsRef.current = data.conversations || [];
  }, [data.conversations]);

  useEffect(() => {
    if (!pusherRef.current && token) {
      pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
        cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
        authEndpoint: "/api/broadcasting/auth",
        auth: {
          headers: { Authorization: `Bearer ${token}` },
        },
      });
    }
  }, [token]);

  useEffect(() => {
    if (pusherRef.current) {
      const channel = pusherRef.current.subscribe(channelName);
      channel.bind("new_message", (eventData: any) => {
        const newMessage: Message = {
          id: eventData.id,
          text: eventData.content,
          senderId: eventData.sender_id,
          timestamp: `${eventData.date} ${eventData.timestamp}`,
          content_type: eventData.content_type,
        };
        const currentConversations = conversationsRef.current;
        const messageExists = currentConversations.some(
          (msg) => msg.id === newMessage.id
        );
        if (!messageExists) {
          const updatedConversations = [
            ...currentConversations,
            newMessage,
          ].sort((a, b) => a.id - b.id);
          setChatData("conversations", updatedConversations);
        }
      });

      return () => {
        channel.unbind("new_message");
        pusherRef.current?.unsubscribe(channelName);
      };
    }
  }, [channelName, setChatData]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/messages/conversations/user/${id}`);
        if (response.data.status === "success") {
          const mappedMessages: Message[] = response.data.messages.map(
            (msg: any) => ({
              id: msg.id,
              text: msg.content,
              senderId: msg.sender_id,
              timestamp: `${msg.date} ${msg.timestamp}`,
              content_type: msg.content_type,
            })
          );
          setChatData("conversations", mappedMessages);
        }
      } catch (error) {
        // Handled by api's interceptor
      }
    };
    if (id && token) fetchMessages();
  }, [id, token, setChatData]);

  useEffect(() => {
    return () => {
      if (pusherRef.current) {
        pusherRef.current.disconnect();
      }
    };
  }, []);

  return null;
};

export default useGetConversationWithPusher;
