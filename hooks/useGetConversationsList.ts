// import { useEffect, useRef, useState } from "react";
// import { useChatStore } from "@/store/message";
// import { useAuthStore } from "@/store/authStore";
// import Pusher from "pusher-js";
// import api from "@/services/api";

// interface Conversation {
//   id: number;
//   name: string;
//   imageUrl: string | null;
//   time: string;
//   message: string;
//   message_type: string;
//   unread_count: number;
// }

// const useConversationsList = () => {
//   const { setChatData } = useChatStore();
//   const token = useAuthStore((state) => state.token);
//   const userId = useAuthStore((state) => state.user_id);
//   const loggedInUserId = useAuthStore((state) => state.user_id);
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const pusherRef = useRef<Pusher | null>(null);

//   useEffect(() => {
//     if (!pusherRef.current && token) {
//       pusherRef.current = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
//         cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER!,
//         authEndpoint: "/api/broadcasting/auth",
//         auth: {
//           headers: { Authorization: `Bearer ${token}` },
//         },
//       });
//     }
//   }, [token]);

//   useEffect(() => {
//     if (pusherRef.current && userId) {
//       const channel = pusherRef.current.subscribe(`private-user.${userId}`);
//       channel.bind(".conversations.updated", (data: any) => {
//         const transformed = transformConversations(data.conversations).filter(
//           (msg) => msg.id !== loggedInUserId
//         );
//         setConversations(transformed);
//         setChatData("users_messages", transformed);
//       });
//       channel.bind(".message.received", () => {
//         fetchConversations();
//       });

//       return () => {
//         channel.unbind_all();
//         pusherRef.current?.unsubscribe(`private-user.${userId}`);
//       };
//     }
//   }, [userId, setChatData, loggedInUserId]);

//   const fetchConversations = async () => {
//     try {
//       const response = await api.get("/messages");
//       if (response.data.status === "success") {
//         const transformed = transformConversations(
//           response.data.conversations
//         ).filter((msg) => Number(msg.id) !== loggedInUserId);
//         setConversations(transformed);
//         setChatData("users_messages", transformed);
//       }
//     } catch (error) {
//       // Handled by api's interceptor
//     }
//   };

//   useEffect(() => {
//     if (token) fetchConversations();
//   }, [token]);

//   useEffect(() => {
//     return () => {
//       if (pusherRef.current) {
//         pusherRef.current.disconnect();
//       }
//     };
//   }, []);

//   const transformConversations = (conversations: any[]): Conversation[] => {
//     return conversations.map((conv) => ({
//       id: conv.participant_id,
//       name: conv.participant_name,
//       imageUrl: conv.profile_picture,
//       time: conv.latest_message_time,
//       message: conv.latest_message,
//       message_type: conv.latest_message_type,
//       unread_count: conv.unread_count,
//     }));
//   };

//   return { conversations, loading: !conversations.length, error: null };
// };

// export default useConversationsList;
