import { useEffect } from "react";
import { useChatStore } from "@/store/message";
import { useAuthStore } from "@/store/authStore";

type MessageType = {
  id: string;
  text: string;
  senderId: string;
  timestamp: string;
};

const useGetConversation = (id: string) => {
  const { data, setChatData } = useChatStore(); // Directly destructure data from store
  const token = useAuthStore.getState().token;

  useEffect(() => {
    const fetchSSE = () => {
      const controller = new AbortController();
      const signal = controller.signal;

      fetch(`https://be1.ourproperty.ng/api/v1/messages/sse/user/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
        signal,
      })
        .then((response) => {
          const reader = response?.body?.getReader();
          const decoder = new TextDecoder();
          let stream = "";

          reader?.read().then(function processText({ done, value }) {
            if (done) {
              console.log("Stream finished.");
              return;
            }

            stream += decoder.decode(value, { stream: true });
            const messages = stream.split("\n");

            messages.forEach((message) => {
              if (message) {
                const lines = message.split("\n");
                const dataLine = lines.find((line) => line.startsWith("data:"));

                if (dataLine) {
                  try {
                    const jsonData = dataLine.replace("data:", "").trim(); // Extract the JSON string after "data:"
                    const newMessage: MessageType = JSON.parse(jsonData);

                    // console.log("New Message Received:", newMessage);

                    // Get the current conversations from store
                    const currentConversations = data.conversations || [];

                    // Check if the new message is unique (based on ID) and add it
                    const messageExists = currentConversations.some(
                      (message: MessageType) => message.id === newMessage.id
                    );

                    if (!messageExists) {
                      // Update the store with the new message (append to the existing messages)
                      setChatData("conversations", [...currentConversations, newMessage]);
                    }
                  } catch (error) {
                    console.error("Error parsing SSE message:", error);
                  }
                }
              }
            });

            reader?.read().then(processText);
          });
        })
        .catch((error) => {
          console.error("SSE Error:", error);
        });

      return controller;
    };

    fetchSSE();

    return () => {
      // Cleanup if necessary
    };
  }, [id, setChatData, token]);

  return null;
};

export default useGetConversation;