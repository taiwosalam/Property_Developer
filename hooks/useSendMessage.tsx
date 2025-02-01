// import { useState } from "react";
// import { useChatStore } from "@/store/message";
// import api from "@/services/api";

// const useSendMessage = (conversationId: string) => {
//   const [loading, setLoading] = useState(false);
// //   const { setChatData, chatData } = useChatStore();

//   const sendMessage = async (message: string) => {
//     if (!message.trim()) return;
    
//     setLoading(true);
    
//     try {
//       const response = await api.post(`/messages/conversation/${conversationId}/send`, { message });

//       if (!response.ok || response.status !== 201) throw new Error("Failed to send message");

//       const newMessage = await response.json();

//       // Update chat store immediately
//       setChatData("messages", [...chatData.messages, newMessage]);
//     } catch (error) {
//       console.error("Error sending message:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return { sendMessage, loading };
// };

// export default useSendMessage;
