"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useChatStore } from "@/store/message";
import { groupMessagesByDay } from "../data"; // The new grouping helper
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { empty } from "@/app/config";
import { UsersProps } from "../types";
import ChatSkeleton from "@/components/Skeleton/chatSkeleton";
import { useAuthStore } from "@/store/authStore";
import { getLocalStorage } from "@/utils/local-storage";
import Link from "next/link";
import useConversationListener from "@/hooks/useConversationListen";
import api from "@/services/api";
import { useGlobalStore } from "@/store/general-store";

interface Message {
  id: number;
  text: string | null;
  senderId: number;
  timestamp: string;
  content_type: string;
}

const Chat = () => {
  const router = useRouter();
  const { data, setChatData } = useChatStore();
  const { id } = useParams<{ id: string }>();
  const user_id = useAuthStore((state) => state.user_id);
  const users = data?.users?.users || [];
  const messageUserData = useGlobalStore((s) => s.messageUserData);
  const store_messages = data?.conversations || [];
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPusherFailed, setIsPusherFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
    try {
      setError(null);
      const response = await api.get(`/messages/conversations/user/${id}`);
      console.log("API response:", response.data);
      if (response.data.status === "success") {
        const mappedMessages: Message[] = response.data.messages.map(
          (msg: any) => ({
            id: msg.id,
            text: msg.content ?? null,
            senderId: msg.sender_id,
            // timestamp: `${msg.date} ${msg.timestamp}`,
            timestamp: `${msg.updated_at} ${msg.timestamp}`,
            content_type: msg.content_type,
          })
        );
        setChatData("conversations", mappedMessages);
      } else {
        setError("Failed to load messages.");
      }
    } catch (error: any) {
      console.error("API error:", error.response?.data || error.message);
      setError("Failed to load messages. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [id, setChatData]);

  // Handle new Pusher messages
  const handleNewMessage = useCallback(
    (newMessage: Message) => {
      const updatedConversations = [...store_messages, newMessage].sort(
        (a, b) => a.id - b.id
      );
      setChatData("conversations", updatedConversations);
    },
    [store_messages, setChatData]
  );

  // Initialize Pusher and fetch messages
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setConversations([]);
    setChatData("conversations", []);
    fetchMessages();

    return () => {
      setConversations([]);
      setChatData("conversations", []);
    };
  }, [id, fetchMessages, setChatData]);

  // Polling when Pusher fails
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;

    if (isPusherFailed) {
      console.log("Pusher failed, switching to polling every 30 seconds...");
      pollingInterval = setInterval(() => {
        fetchMessages();
      }, 30000);
    }

    return () => {
      if (pollingInterval) {
        console.log("Stopping polling...");
        clearInterval(pollingInterval);
      }
    };
  }, [isPusherFailed, fetchMessages]);

  // Update grouped conversations when messages change
  useEffect(() => {
    if (store_messages.length > 0) {
      const groupedMessages = groupMessagesByDay(store_messages);
      setConversations(groupedMessages);
    }
  }, [store_messages]);

  // Pusher subscription
  useConversationListener(id, handleNewMessage, (error: any) => {
    console.error("Pusher connection failed:", error);
    setIsPusherFailed(true);
  });

  // Find user
  const userId = Number(id);
  const user = messageUserData || users.find((u: UsersProps) => Number(u.id) === Number(userId));

  if (!user) {
    router.replace("/messages");
    return null;
  }

  if (isLoading) {
    return <ChatSkeleton />;
  }

  return (
    <>
      <div className="py-4 px-6 bg-neutral-2 dark:bg-black">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/messages")}>
            <Picture src="/icons/chevron-left.svg" alt="back" size={20} />
          </button>
          <Link
            href={`/management/staff-branch/${user.branch_id}/branch-staff/${user?.staff_id}`}
            className="flex items-center gap-4 text-left"
          >
            <Picture
              src={user?.imageUrl || empty}
              alt="profile picture"
              containerClassName="custom-secondary-bg rounded-full"
              size={32}
              rounded
              status={false}
            />
            <div className="custom-flex-col">
              <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                {user?.name}
              </p>
              <p className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal">
                Tap here for contact info
              </p>
            </div>
          </Link>
        </div>
      </div>
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
      {error && (
          <div className="text-red-500 text-center p-2">{error}</div>
        )}
        {conversations.length > 0 &&
          conversations.map((group, index) => (
            <Messages
              key={index}
              day={group.day}
              messages={group.messages}
              userId={user_id as string}
            />
          ))}
      </div>
    </>
  );
};

export default Chat;




















// const Chat = () => {
//   const router = useRouter();
//   const { data, setChatData } = useChatStore();
//   const { id } = useParams<{ id: string }>();
//   const user_id = useAuthStore((state) => state.user_id);
//   const users = data?.users?.users || [];
//   const messageUserData = useGlobalStore((s) => s.messageUserData);
//   const store_messages = data?.conversations || [];
//   const [conversations, setConversations] = useState<any[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isPusherFailed, setIsPusherFailed] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch messages from API
//   const fetchMessages = useCallback(async () => {
//     try {
//       setError(null);
//       const response = await api.get(`/messages/conversations/user/${id}`);
//       if (response.data.status === "success") {
//         const mappedMessages: Message[] = response.data.messages.map(
//           (msg: any) => ({
//             id: msg.id,
//             text: msg.content ?? null,
//             senderId: msg.sender_id,
//             timestamp: `${msg.date} ${msg.timestamp}`,
//             content_type: msg.content_type,
//           })
//         );
//         setChatData("conversations", mappedMessages);
//       } else {
//         setError("Failed to load messages.");
//       }
//     } catch (error: any) {
//       console.error("API error:", error.response?.data || error.message);
//       setError("Failed to load messages. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [id, setChatData]);

//   // Handle new Pusher messages
//   const handleNewMessage = useCallback(
//     (newMessage: Message) => {
//       const updatedConversations = [...store_messages, newMessage].sort(
//         (a, b) => a.id - b.id
//       );
//       setChatData("conversations", updatedConversations);
//     },
//     [store_messages, setChatData]
//   );

//   // Initialize Pusher and fetch messages
//   useEffect(() => {
//     if (!id) {
//       setIsLoading(false);
//       return;
//     }

//     setIsLoading(true);
//     setConversations([]);
//     setChatData("conversations", []);
//     fetchMessages();

//     return () => {
//       setConversations([]);
//       setChatData("conversations", []);
//     };
//   }, [id, fetchMessages, setChatData]);

//   // Polling when Pusher fails
//   useEffect(() => {
//     let pollingInterval: NodeJS.Timeout | null = null;

//     if (isPusherFailed) {
//       console.log("Pusher failed, switching to polling every 30 seconds...");
//       pollingInterval = setInterval(() => {
//         fetchMessages();
//       }, 30000);
//     }

//     return () => {
//       if (pollingInterval) {
//         console.log("Stopping polling...");
//         clearInterval(pollingInterval);
//       }
//     };
//   }, [isPusherFailed, fetchMessages]);

//   // Update grouped conversations when messages change
//   useEffect(() => {
//     if (store_messages.length > 0) {
//       const groupedMessages = groupMessagesByDay(store_messages);
//       setConversations(groupedMessages);
//     }
//   }, [store_messages]);

//   // Pusher subscription
//   useConversationListener(id, handleNewMessage, (error: any) => {
//     console.error("Pusher connection failed:", error);
//     setIsPusherFailed(true);
//   });

//   // Find user
//   const userId = Number(id);
//   const user = messageUserData || users.find((u: UsersProps) => u.id === userId);

//   if (!user) {
//     router.replace("/messages");
//     return null;
//   }

//   if (isLoading) {
//     return <ChatSkeleton />;
//   }

//   return (
//     <>
//       <div className="py-4 px-6 bg-neutral-2 dark:bg-black">
//         <div className="flex items-center gap-3">
//           <button onClick={() => router.push("/messages")}>
//             <Picture src="/icons/chevron-left.svg" alt="back" size={20} />
//           </button>
//           <Link
//             href={`/management/staff-branch/${user.branch_id}/branch-staff/${user?.staff_id}`}
//             className="flex items-center gap-4 text-left"
//           >
//             <Picture
//               src={user?.imageUrl || empty}
//               alt="profile picture"
//               containerClassName="custom-secondary-bg rounded-full"
//               size={32}
//               rounded
//               status={false}
//             />
//             <div className="custom-flex-col">
//               <p className="text-text-primary dark:text-white text-base font-medium capitalize">
//                 {user?.name}
//               </p>
//               <p className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal">
//                 Tap here for contact info
//               </p>
//             </div>
//           </Link>
//         </div>
//       </div>
//       <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
//         {error && (
//           <div className="text-red-500 text-center p-2">{error}</div>
//         )}
//         {conversations.length > 0 ? (
//           conversations.map((group, index) => (
//             <Messages
//               key={index}
//               day={group.day}
//               messages={group.messages}
//               userId={user_id as string}
//             />
//           ))
//         ) : (
//           <p className="text-center text-text-disabled">No messages yet.</p>
//         )}
//       </div>
//     </>
//   );
// };

// export default Chat;