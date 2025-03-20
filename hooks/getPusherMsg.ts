// import { useEffect, useRef } from "react";
// import { useChatStore } from "@/store/message";
// import { useAuthStore } from "@/store/authStore";
// import Pusher from "pusher-js";

// const useGetConversationWithPusher = (id: string) => {
//   const { data, setChatData } = useChatStore();
//   const token = useAuthStore((state) => state.token);
//   const currentUserId = useAuthStore((state) => state.user_id);

//   // Calculate channel name based on sorted user IDs
//   const [minId, maxId] = [currentUserId, Number(id)].sort((a, b) => a - b);
//   const channelName = `private-conversation-${minId}-${maxId}`;

//   const pusherRef = useRef<Pusher | null>(null);
//   const conversationsRef = useRef(data.conversations || []);

//   useEffect(() => {
//     conversationsRef.current = data.conversations || [];
//   }, [data.conversations]);

//   // Initialize Pusher
//   useEffect(() => {
//     if (!pusherRef.current) {
//       pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
//         cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
//         authEndpoint: "/pusher/auth",
//         auth: {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       });
//     }
//   }, [token]);

//   // Subscribe to channel for real-time updates
//   useEffect(() => {
//     if (pusherRef.current) {
//       const channel = pusherRef.current.subscribe(channelName);
//       channel.bind("new_message", (newMessage) => {
//         const currentConversations = conversationsRef.current;
//         const messageExists = currentConversations.some(
//           (msg) => msg.id === newMessage.id
//         );
//         if (!messageExists) {
//           const updatedConversations = [...currentConversations, newMessage].sort(
//             (a, b) => a.id - b.id
//           );
//           setChatData("conversations", updatedConversations);
//         }
//       });

//       return () => {
//         channel.unbind("new_message");
//         pusherRef.current?.unsubscribe(channelName);
//       };
//     }
//   }, [channelName, setChatData]);

//   // Fetch initial messages
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(`/messages/conversations/user/${id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const result = await response.json();
//         const mappedMessages = result.messages.map((msg) => ({
//           id: msg.id,
//           text: msg.content,
//           senderId: msg.sender_id,
//           timestamp: `${msg.date} ${msg.timestamp}`,
//         }));
//         setChatData("conversations", mappedMessages);
//       } catch (error) {
//         console.error("Error fetching initial messages:", error);
//       }
//     };
//     fetchMessages();
//   }, [id, token, setChatData]);

//   useEffect(() => {
//     return () => {
//       if (pusherRef.current) pusherRef.current.disconnect();
//     };
//   }, []);

//   return null;
// };

// export default useGetConversationWithPusher;