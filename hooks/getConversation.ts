import { useEffect } from "react";
import { useChatStore } from "@/store/message";
import { useAuthStore } from "@/store/authStore";
import { fetchEventSource } from "@microsoft/fetch-event-source";

type MessageType = {
  id: number; // Use a number for easier sorting
  text: string;
  senderId: number;
  timestamp: string;
};

const useGetConversation = (id: string) => {
  const { data, setChatData } = useChatStore();
  const token = useAuthStore.getState().token;

  useEffect(() => {
    const controller = new AbortController();

    fetchEventSource(`https://be1.ourproperty.ng/api/v1/messages/sse/user/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "text/event-stream",
      },
      signal: controller.signal,
      onmessage: (ev) => {
        try {
          const newMessage: MessageType = JSON.parse(ev.data);
          const currentConversations = data.conversations || [];

          const messageExists = currentConversations.some(
            (msg: MessageType) => msg.id === newMessage.id
          );
          if (!messageExists) {
            const updatedConversations = [...currentConversations, newMessage].sort(
              (a, b) => a.id - b.id
            );
            setChatData("conversations", updatedConversations);
          }
        } catch (error) {
          console.error("Error parsing SSE message:", error);
        }
      },
      onopen: async (response: Response) => {
        if (response.ok && response.status === 200) {
          console.log("Connection established.");
        } else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          console.error("Client error encountered, closing connection:", response.status);
          throw new Error("Client error, closing connection.");
        }
      },
      onerror: (err) => {
        console.error("SSE connection error:", err);
      },
    });

    return () => {
      controller.abort();
    };
  }, [id, token, data.conversations, setChatData]);

  return null;
};

export default useGetConversation;
