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
  const usersData = useChatStore((state) => state?.data?.users);
  const { id } = useParams<{ id: string }>();
  const user_id = useAuthStore((state) => state.user_id);
  const users = usersData?.users || [];
  const messageUserData = useGlobalStore((s) => s.messageUserData);
  const setGlobalInfoStore = useGlobalStore((s) => s.setGlobalInfoStore);
  const userId = Number(id);
  const [isLoading, setIsLoading] = useState(true);
  const store_messages = useChatStore((state) => state?.data?.conversations);
  const [conversations, setConversations] = useState<any[]>([]);
  const users_Id = getLocalStorage("user_id");
  const [isPusherFailed, setIsPusherFailed] = useState(false);

  // Clear local conversation & store state when conversation id changes.
  useEffect(() => {
    console.log("Chat user_id:", user_id, "participant id:", id);
    setConversations([]);
    setChatData("conversations", []);
  }, [id, setChatData]);

  // Memoize the callback to prevent re-subscribing on every render.
  const handleNewMessage = useCallback(
    (newMessage: Message) => {
      console.log("Adding new message:", newMessage);
      const updatedConversations = [...(store_messages || []), newMessage].sort(
        (a, b) => a.id - b.id
      );
      setChatData("conversations", updatedConversations);
    },
    [store_messages, setChatData]
  );

  // Fetch messages from API
  const fetchMessages = useCallback(async () => {
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
      }
    } catch (error: any) {
      console.error("API error:", error.response?.data || error.message);
    }
  }, [id, setChatData]);


  // Initiate Pusher listener with error handling
  useConversationListener(id, handleNewMessage, (error: any) => {
    console.error("Pusher connection failed:", error);
    setIsPusherFailed(true); // Set failure state to trigger polling
  });

  // Polling logic when Pusher fails
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;

    if (isPusherFailed) {
      console.log("Switching to polling every 5 seconds...");
      pollingInterval = setInterval(() => {
        fetchMessages();
      }, 5000);
    }

    // Cleanup polling on unmount or when Pusher reconnects (optional)
    return () => {
      if (pollingInterval) {
        console.log("Stopping polling...");
        clearInterval(pollingInterval);
      }
    };
  }, [isPusherFailed, fetchMessages]);

  // Initial fetch and cleanup
  useEffect(() => {
    setConversations([]);
    setChatData("conversations", []);
    if (id) fetchMessages();
  }, [id, setChatData, fetchMessages]);

  // useEffect(() => {
  //   // Clear existing conversations
  //   setConversations([]);
  //   setChatData("conversations", []);
  //   const fetchMessages = async () => {
  //     try {
  //       const response = await api.get(`/messages/conversations/user/${id}`);
  //       console.log("API response:", response.data);
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
  //         console.log("Mapped messages:", mappedMessages);
  //         setChatData("conversations", mappedMessages);
  //       }
  //     } catch (error: any) {
  //       console.error("API error:", error.response?.data || error.message);
  //     }
  //   };
  //   if (id) fetchMessages();
  // }, [id, setChatData]);

  useEffect(() => {
    console.log("Store messages updated:", store_messages);
    if (store_messages && store_messages.length > 0) {
      const groupedMessages = groupMessagesByDay(store_messages);
      console.log("Grouped messages:", groupedMessages);
      setConversations(groupedMessages);
    }
  }, [store_messages]);

  
  useEffect(() => {
    if (usersData) {
      setIsLoading(false);
    }
  }, [usersData]);

  if (isLoading) {
    return <ChatSkeleton />;
  }

  //

  // // If user not found, redirect to messages page.
  const findUser = users.find((user: UsersProps) => Number(user.id) === userId);

  const user = messageUserData || findUser;

  console.log("user data", user);
  if (!user) {
    router.replace("/messages");
    return null;
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
