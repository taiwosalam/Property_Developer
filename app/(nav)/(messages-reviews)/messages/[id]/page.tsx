"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useChatStore } from "@/store/message";
import {
  DirectChatAPIResponse,
  GroupChatAPIResponse,
  groupMessagesByDay,
  isDirectChatResponse,
  isGroupChatResponse,
  transformMessagesFromAPI,
} from "../data";
import Picture from "@/components/Picture/picture";
import Messages from "@/components/Message/messages";
import { empty } from "@/app/config";
import { UsersProps } from "../types";
import ChatSkeleton from "@/components/Skeleton/chatSkeleton";
import { useAuthStore } from "@/store/authStore";
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

const useUserProfile = (id: string | number) => {
  const { data, loading } = useFetch<UserDetailsResponse>(
    `/all-users?identifier=${id}`
  );
  return { profile: data?.data, loading };
};

const useGroupedMessages = (store_messages: any[]) => {
  const [conversations, setConversations] = useState<any[]>([]);
  useEffect(() => {
    if (store_messages.length > 0) {
      setConversations(groupMessagesByDay(store_messages));
    }
  }, [store_messages]);
  return conversations;
};

const useShowContactInfo = (user: any) => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const showStatus = user?.last_seen?.toLowerCase() !== "offline";
  useEffect(() => {
    if (!showStatus) return;
    const interval = setInterval(
      () => setShowContactInfo((prev) => !prev),
      30000
    );
    return () => clearInterval(interval);
  }, [showStatus]);
  return showContactInfo;
};

const Chat = () => {
  // ----- Hooks/Data -----
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data, setChatData } = useChatStore();
  const isGroupChat = useGlobalStore((s) => s.isGroupChat);
  const user_id = useAuthStore((state) => state.user_id);
  const users = data?.users?.users || [];
  const messageUserData = useGlobalStore((s) => s.messageUserData);
  const store_messages = data?.conversations || [];
  const [isLoading, setIsLoading] = useState(true);

  // User lookup and info
  const userId = Number(id);
  const user: UsersProps | undefined =
    messageUserData || users.find((u: UsersProps) => Number(u.id) === userId);

  // Remote profile fetch (optional, if you want richer info)
  const { profile: userProfileData, loading: loadingUser } = useUserProfile(id);

  // Compose role/badge logic
  const role = getCleanRoleName(userProfileData);
  const isAcct = role === "director" || role === "manager" || role === "staff";
  const showActBadge = isAcct && userProfileData?.tier_id === 2;
  const badgeColor =
    tierColorMap[userProfileData?.tier_id as keyof typeof tierColorMap] ||
    "gray";

  // Conversation grouping
  const conversations = useGroupedMessages(store_messages);

  // Contact status cycling
  const showContactInfo = useShowContactInfo(user);

  // Endpoint logic
  const endpoint = isGroupChat
    ? `/group-chats/${id}`
    : `/messages/conversations/${id}`;

  // Message API fetch
  const {
    data: apiData,
    loading,
    error,
    refetch,
  } = useFetch<GroupChatAPIResponse | DirectChatAPIResponse>(endpoint);
  useRefetchOnEvent("refetchMessages", () => refetch({ silent: true }));

  // Poll for new messages every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      window.dispatchEvent(new Event("refetchMessages"));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // TRANSFORM MESSAGES FROM API RESPONSE
  useEffect(() => {
    if (!apiData) return;
    if (isGroupChat && isGroupChatResponse(apiData)) {
      const normalizedMessages = transformMessagesFromAPI(apiData, true);
      setChatData("conversations", normalizedMessages);

      setIsLoading(false);
    } else if (!isGroupChat && isDirectChatResponse(apiData)) {
      const normalizedMessages = transformMessagesFromAPI(apiData, false);
      setChatData("conversations", normalizedMessages);
      if (apiData.messages.length > 0) {
        setChatData("receiver", apiData.messages[0].receiver);
      }
      setIsLoading(false);
    }
  }, [apiData, setChatData, isGroupChat]);

  // ----- UI Guards -----
  if (!user) {
    router.replace("/messages");
    return null;
  }
  if (loading || isLoading) {
    return <ChatSkeleton />;
  }

  // ----- Render -----
  return (
    <>
      {/* Header */}
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
                  status={user?.last_seen?.toLowerCase() === "online"}
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

      {/* Messages */}
      <div className="py-5 px-6 flex-1 overflow-auto custom-round-scrollbar bg-white dark:bg-black custom-flex-col gap-8">
        {error && <div className="text-red-500 text-center p-2">{error}</div>}
        {conversations.length > 0 &&
          conversations.map((group, index) => (
            <Messages
              key={index}
              day={group.day}
              messages={group.messages}
              userId={user_id as string}
              chat_type={isGroupChat ? "group" : "private"}
            />
          ))}
      </div>
    </>
  );
};

export default Chat;
