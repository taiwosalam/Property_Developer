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
import { Modal, ModalContent, ModalTrigger } from "@/components/Modal/modal";
import { motion, AnimatePresence } from "framer-motion";
import MessageUserProfileModal from "@/components/Message/message-user-profile";
import { capitalizeWords } from "@/hooks/capitalize-words";
import { UserDetailsResponse } from "@/components/Message/types";
import { getCleanRoleName } from "@/components/Message/data";
import useFetch from "@/hooks/useFetch";
import BadgeIcon, { tierColorMap } from "@/components/BadgeIcon/badge-icon";
import useRefetchOnEvent from "@/hooks/useRefetchOnEvent";

interface Message {
  id: number;
  text: string | null;
  senderId: number | string;
  timestamp: string;
  content_type: string;
}
interface MessagesApiResponse {
  status: string;
  messages: Array<{
    id: number;
    content: string | null;
    sender_id: string | number;
    date: string;
    timestamp: string;
    content_type: string;
    receiver?: any;
  }>;
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
  const [isPusherFailed, setIsPusherFailed] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [showContactInfo, setShowContactInfo] = useState(false);

  // USER TO CHAT DATA
  const {
    data: userProfile,
    error: userError,
    loading: loadingUser,
  } = useFetch<UserDetailsResponse>(`/all-users?identifier=${id}`);
  const userProfileData = userProfile?.data ?? null;

  const role = getCleanRoleName(userProfileData);
  const isAcct = role === "director" || role === "manager" || role === "staff";
  const showActBadge = isAcct && userProfileData?.tier_id === 2;

  const badgeColor =
    tierColorMap[userProfileData?.tier_id as keyof typeof tierColorMap] ||
    "gray";

  // FETCH MESSAGES

  // Fetch messages using useFetch
  const {
    data: apiData,
    loading,
    silentLoading,
    isNetworkError,
    error,
    refetch,
  } = useFetch<MessagesApiResponse>(`/messages/conversations/user/${id}`);
  useRefetchOnEvent("refetchMessages", () => refetch({ silent: true }));

  // Fetch messages from API
  // const fetchMessages = useCallback(async () => {
  //   try {
  //     setError(null);
  //     const response = await api.get(`/messages/conversations/user/${id}`);
  //     if (response.data.status === "success") {
  //       const mappedMessages: Message[] = response.data.messages.map(
  //         (msg: any) => ({
  //           id: msg.id,
  //           text: msg.content ?? null,
  //           senderId: msg.sender_id,
  //           timestamp: `${msg.date} ${msg.timestamp}`,
  //           content_type: msg.content_type,
  //         })
  //       );
  //       // Store conversations and receiver (from the first message)
  //       setChatData("conversations", mappedMessages);
  //       if (response.data.messages.length > 0) {
  //         setChatData("receiver", response.data.messages[0].receiver);
  //       }
  //     } else {
  //       setError("Failed to load messages.");
  //     }
  //   } catch (error: any) {
  //     console.error("API error:", error.response?.data || error.message);
  //     setError("Failed to load messages. Please try again later.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [id, setChatData]);

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

  // Transform API data and update store
  useEffect(() => {
    if (apiData && apiData.status === "success") {
      const mappedMessages: Message[] = apiData.messages.map((msg) => ({
        id: msg.id,
        text: msg.content ?? null,
        senderId: msg.sender_id,
        timestamp: `${msg.date} ${msg.timestamp}`,
        content_type: msg.content_type,
      }));
      setChatData("conversations", mappedMessages);
      if (apiData.messages.length > 0) {
        setChatData("receiver", apiData.messages[0].receiver);
      }
    }
  }, [apiData, setChatData]);

  // Polling when needed
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null;

    if (isPusherFailed) {
      pollingInterval = setInterval(() => {
        refetch({ silent: true });
      }, 5000); // Poll every 5 seconds
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [isPusherFailed, refetch]);

  // Initialize Pusher and fetch messages
  // useEffect(() => {
  //   if (!id) {
  //     setIsLoading(false);
  //     return;
  //   }

  //   // Reset state immediately when id changes
  //   setIsLoading(true);
  //   setConversations([]);
  //   setChatData("conversations", []);
  //   setChatData("receiver", null); // Clear receiver data
  //   fetchMessages();

  //   return () => {
  //     setConversations([]);
  //     setChatData("conversations", []);
  //     setChatData("receiver", null); // Clear receiver on cleanup
  //   };
  // }, [id, fetchMessages, setChatData]);

  // Polling when Pusher fails
  // useEffect(() => {
  //   let pollingInterval: NodeJS.Timeout | null = null;

  //   if (isPusherFailed) {
  //     console.log("Pusher failed, switching to polling every 30 seconds...");
  //     pollingInterval = setInterval(() => {
  //       fetchMessages();
  //     }, 30000);
  //   }

  //   return () => {
  //     if (pollingInterval) {
  //       console.log("Stopping polling...");
  //       clearInterval(pollingInterval);
  //     }
  //   };
  // }, [isPusherFailed, fetchMessages]);

  // Update grouped conversations when messages change
  useEffect(() => {
    if (store_messages.length > 0) {
      const groupedMessages = groupMessagesByDay(store_messages);
      setConversations(groupedMessages);
    }
  }, [store_messages]);

  // Pusher subscription
  // useConversationListener(id, handleNewMessage, (error: any) => {
  //   console.error("Pusher connection failed:", error);
  //   setIsPusherFailed(true);
  // });

  // Find user
  const userId = Number(id);
  const user =
    messageUserData ||
    users.find((u: UsersProps) => Number(u.id) === Number(userId));
  const isOnline = user?.last_seen?.toLowerCase() === "online";
  const showStatus = user?.last_seen?.toLowerCase() !== "offline";

  //SHOW CONTACT INFO
  useEffect(() => {
    if (showStatus) {
      const interval = setInterval(() => {
        setShowContactInfo((prev) => !prev);
      }, 30000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [showStatus]);

  if (!user) {
    router.replace("/messages");
    return null;
  }

  if (loading) {
    return <ChatSkeleton />;
  }

  return (
    <>
      <div className="py-4 px-6 bg-neutral-2 dark:bg-black">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/messages")}>
            <Picture src="/icons/chevron-left.svg" alt="back" size={20} />
          </button>
          <Modal>
            <ModalTrigger>
              <div className="flex items-center gap-4 text-left">
                <Picture
                  src={user?.imageUrl || empty}
                  alt="profile picture"
                  containerClassName="custom-secondary-bg rounded-full"
                  size={35}
                  rounded
                  status={isOnline}
                />
                <div className="custom-flex-col">
                  <div className="flex items-center">
                    <p className="text-text-primary dark:text-white text-base font-medium capitalize">
                      {capitalizeWords(user?.name ?? "")}
                    </p>
                    {showActBadge ? (
                      <BadgeIcon color="gray" />
                    ) : !isAcct ? (
                      <BadgeIcon color={badgeColor} />
                    ) : null}
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={showContactInfo ? "contact" : "status"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.3 }}
                      className="text-text-disabled dark:text-darkText-2 text-[10px] font-normal"
                    >
                      {showContactInfo
                        ? user.last_seen
                        : "Tap here for contact info"}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>
            </ModalTrigger>
            <ModalContent>
              <MessageUserProfileModal id={Number(id)} />
            </ModalContent>
          </Modal>
        </div>
      </div>
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        {error && <div className="text-red-500 text-center p-2">{error}</div>}
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
